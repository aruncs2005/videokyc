import json
import boto3
import base64
import cv2
import numpy as np

client = boto3.client("rekognition")

def analyse_image(imagebytes):
    print("inside analyse")
    print(imagebytes)
    response = client.detect_faces(
        Image={
            'Bytes': imagebytes
        },
        Attributes=[
        'ALL',
    ]
    )
    print(response)
    return response

def process_response(response):
    face_details = response['FaceDetails']
    return face_details


def get_face_image(image_array,oheight,owidth,faceDetail):
    width = faceDetail[0]['BoundingBox']['Width']
    height = faceDetail[0]['BoundingBox']['Height']
    left = faceDetail[0]['BoundingBox']['Left']
    top = faceDetail[0]['BoundingBox']['Top']
    print(image_array.shape)
    print(width,height,left,top)
    print(oheight,owidth)
    w = int(width * owidth)
    h = int(height * oheight)
    x = int(left * owidth)
    y = int(top * oheight)
    print(w,h,x,y)
    #img2 = image_array[y:h, x:w]
    img2 = image_array[y:y+h, x:x+w]
         
    return img2
  
def construct_response(output,encoded_face_image):
  resp_data = output[0]
  face_details = {
    "gender": resp_data["Gender"],
    "smile": resp_data["Smile"],
    "eyesOpen":resp_data["EyesOpen"],
    "agerange": {
      "low": resp_data["AgeRange"]["Low"],
      "high": resp_data["AgeRange"]["High"],
    },
    "pose":{
      "roll": resp_data["Pose"]["Roll"],
      "yaw": resp_data["Pose"]["Yaw"],
      "pitch": resp_data["Pose"]["Pitch"],
    },
    "mouthOpen": resp_data["MouthOpen"],
    "encoded_face_image":encoded_face_image
  }
  return face_details
  
    

def handler(event, context):
  print('received event from amplify:')
  print(event)
  
  if "body" in event:
        try:
            body = json.loads(event["body"])
            print(body)
            if "image_bytes" in body:
                imagedata = bytes(body["image_bytes"][22:],"utf-8")
                print(imagedata)
                image_heigth = int(body["height"])
                image_width = int(body["width"])
                
                
                imagedata = base64.b64decode(imagedata)
                decoded_array = cv2.imdecode(np.frombuffer(imagedata, np.uint8), -1)
                
                
                #s3 = boto3.resource('s3')
                #s3.Bucket('sagemaker-us-east-1-365792799466').put_object(Key='test.jpg', Body=imagedata,ContentType='image/jpeg')
                print(imagedata)
                response = analyse_image(imagedata)
                output = process_response(response)
                
                cv2.imwrite("/tmp/test.jpg", decoded_array)
                
                s3 = boto3.resource('s3')
                #s3.Bucket('sagemaker-us-east-1-365792799466').put_object(Key='test2.jpg', Body=open('/tmp/test.jpg', 'rb'),ContentType='image/jpeg')
                s3.Bucket('sagemaker-us-east-1-365792799466').upload_file('/tmp/test.jpg','rekog/test2.jpg')

                face_image_np = get_face_image(decoded_array,image_heigth,image_width,output)
                
                #print(face_image_np)
                cv2.imwrite("/tmp/face.jpg", face_image_np)
                s3.Bucket('sagemaker-us-east-1-365792799466').upload_file('/tmp/face.jpg','rekog/face.jpg')
                
                retval, buffer = cv2.imencode('.jpg', face_image_np)
                jpg_as_text = base64.b64encode(buffer)
                jpg_as_text = jpg_as_text.decode("utf-8")
                print(jpg_as_text)
                face_object = construct_response(output,jpg_as_text)

            
                return {
                    'statusCode': 200,
                    "headers": {
                      "Access-Control-Allow-Credentials" : True,
                        "Access-Control-Allow-Origin": "*",
                    },
                    'body': json.dumps(face_object)
                }
        except Exception as ex:
            print(ex)
            return{
                'statusCode':500,
                'body':json.dumps(str(ex)),
                "headers": {
                "Access-Control-Allow-Credentials" : True,
                "Access-Control-Allow-Origin": "*",
                }
            }
    
  return {
        'statusCode':500,
        'body':json.dumps("invalid request"),
        "headers": {
                "Access-Control-Allow-Credentials" : True,
                "Access-Control-Allow-Origin": "*",
            }
    }
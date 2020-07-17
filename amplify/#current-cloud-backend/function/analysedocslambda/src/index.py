import json
import boto3
import base64
import cv2
import numpy as np
import re

client = boto3.client("rekognition")

def analyse_image(s3_path):
    print("inside analyse")
    response = client.detect_faces(
        Image={
            'S3Object': {
            'Bucket': 'kyc-storag-bucket204408-dev',
            'Name': s3_path,
        }
        },
        Attributes=[
        'ALL',
    ]
    )
    print(response)
    return response
  
def get_text(s3_path):
  response = client.detect_text(
        Image={
            'S3Object': {
            'Bucket': 'kyc-storag-bucket204408-dev',
            'Name': s3_path,
        }
        }
    )    
  return response


def parse_text_data(detect_text_output):
  det_text =  detect_text_output["TextDetections"]
  text_out = ""
  for item in det_text:
    if item["Type"] == "LINE" and item["Confidence"] > 80:
      text_out += item["DetectedText"]
      text_out += " "
  
  return text_out

def extract_entities(text_out):
  doc_object = {}
  if "Male" in text_out:
    doc_object["Gender"] = "Male"
  if "Female" in text_out:
    doc_object["Gender"] = "Female"
  
  x = re.search("\d{4}\s\d{4}\s\d{4}", text_out)
  
  if x:
    doc_object["IDNumber"] = x.group()
    
  client = boto3.client('comprehend')
  response = client.detect_entities(
    Text=text_out,
    LanguageCode='en'
)
  for entity in response["Entities"]:
    if entity["Type"] == "PERSON":
      doc_object["PersonName"] = entity["Text"]
    if entity["Type"] == "DATE":
      doc_object["DOB"] = entity["Text"]
    if entity["Type"] == "ORGANIZATION":
      doc_object["IssuingEntity"] = entity["Text"]
  
  return doc_object
      
  

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
            if "file_path" in body:
                s3_path = "public/" + body["file_path"]
                
                response = analyse_image(s3_path)
                output = process_response(response)
                
                #Get face base64 string bytes.

                s3 = boto3.client('s3')
                s3.download_file('kyc-storag-bucket204408-dev', s3_path, '/tmp/doc.jpg')

                img = cv2.imread('/tmp/doc.jpg') 
                image_height = img.shape[0]
                image_width = img.shape[1]

                face_image_np = get_face_image(img,image_height,image_width,output)
                
                #print(face_image_np)
                cv2.imwrite("/tmp/face.jpg", face_image_np)
                s3 = boto3.resource('s3')
                s3.Bucket('sagemaker-us-east-1-365792799466').upload_file('/tmp/face.jpg','rekog/face.jpg')
                
                

                retval, buffer = cv2.imencode('.jpg', face_image_np)
                jpg_as_text = base64.b64encode(buffer)
                jpg_as_text = jpg_as_text.decode("utf-8")
                print(jpg_as_text)
                text_response = get_text(s3_path)
                detected_text = parse_text_data(text_response)
                face_object = construct_response(output,jpg_as_text)
                face_object["textAnalysis"] = extract_entities(detected_text)

            
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
import json
import boto3
import base64

client = boto3.client("rekognition")

def compare_faces(imagedatalive,imagedatascan):
    print("inside compare faces")
    response = client.compare_faces(
    SourceImage={
        'Bytes': imagedatalive
    },
    TargetImage={
        'Bytes': imagedatascan
    }
)
    print(response)
    return response


def handler(event, context):
  print('received event from amplify:')
  print(event)
  
  if "body" in event:
        try:
            body = json.loads(event["body"])
            print(body)
            if "image_bytes_live" in body and "image_bytes_scan" in body:
                imagedatalive = bytes(body["image_bytes_live"],"utf-8")
                imagedatalive = base64.b64decode(imagedatalive)
                print(imagedatalive)
                imagedatascan = bytes(body["image_bytes_scan"],"utf-8")
                imagedatascan = base64.b64decode(imagedatascan)
                
                response = compare_faces(imagedatalive,imagedatascan)
                output = response
                
                
            
                return {
                    'statusCode': 200,
                    "headers": {
                      "Access-Control-Allow-Credentials" : True,
                        "Access-Control-Allow-Origin": "*",
                    },
                    'body': json.dumps(output)
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
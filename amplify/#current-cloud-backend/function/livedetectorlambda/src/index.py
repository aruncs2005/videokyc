import json

def handler(event, context):
  print('received event from amplify:')
  print(event)
  return{
            "body": json.dumps({'message': 'Hello from your new Amplify Python lambda!'}),
            "headers": {
                "Access-Control-Allow-Credentials" : 'true',
                "Access-Control-Allow-Origin": "*",
            },
            "statusCode": 200,
  }

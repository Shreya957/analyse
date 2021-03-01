
const express = require('express');
const AWS = require('aws-sdk')
const app = express();
const path = require('path');
const router = express.Router();
var { ComprehendClient, BatchDetectEntitiesCommand, BatchDetectSentimentCommand,BatchDetectKeyPhrasesCommand ,DetectPiiEntitiesCommand} = require("@aws-sdk/client-comprehend");
const comprehend = new ComprehendClient({ region: "us-east-2" });



const bodyParser = require('body-parser');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded());

app.use(bodyParser.json());
app.post('/analyze', async function (req, res) {
  console.log(req.body)
  let incomingTxt = req.body.text;
  const params = {
    TextList: [incomingTxt],
    LanguageCode: 'en',
    EndpointArn: 'arn:aws:iam::892613423932:user/ShreyaLaptop'
  };

  const paramsDE = {
    Text: incomingTxt,
    LanguageCode: 'en',
    EndpointArn: 'arn:aws:iam::892613423932:user/ShreyaLaptop'
  };
  const detectEntity = new BatchDetectEntitiesCommand(
    params
  );
  const detectSentiments = new BatchDetectSentimentCommand(
    params
  );
  const detectKeyphrase = new BatchDetectKeyPhrasesCommand(
    params
  );
const detectPii = new DetectPiiEntitiesCommand(
  paramsDE
  );
  
  let output = await comprehend.send(detectEntity);
  let outputSentiments = await comprehend.send(detectSentiments); 
  let keyphrase = await comprehend.send(detectKeyphrase);
  let pii = await comprehend.send(detectPii);
  //console.log(JSON.stringify(keyphrase.ResultList[0].KeyPhrases));
  //console.log(JSON.stringify(output.ResultList[0].Entities));
  // console.log(JSON.stringify(outputSentiments.ResultList[0]));
  console.log(JSON.stringify(pii.Entities));

  let analyze = { keyPhrases:keyphrase.ResultList[0].KeyPhrases,entities: output.ResultList[0].Entities, sentiment: outputSentiments.ResultList[0], pii: pii.Entities}
  console.log(analyze)
  res.send(analyze);
})

const port = process.env.port || 8000;
console.log("Server Started")
app.listen(port)
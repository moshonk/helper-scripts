var myHeaders = new Headers();
myHeaders.append("Authorization", "Basic YWRtaW46WTN6NDRBSDI=");
myHeaders.append("Content-Type", "application/json");

var requestOptions = {
  method: 'GET',
  headers: myHeaders
};

// const BASE_URL = "http://botswanaemrdemo.intellisoftkenya.com:9901"; // replace with your API URL
const BASE_URL = "http://192.168.53.30/"; // replace with your API URL
const sendRequest = async () => {
  try {
    const tokenResponse = await fetch( BASE_URL + "/openmrs/ws/rest/v1/session", requestOptions)
    .then(response => response.text())
    .then(result = (result) => {
      let sessionId = JSON.parse(result).sessionId;
        console.log(sessionId);
        fetch(BASE_URL + "/openmrs/botswanaemr/runReport.page?reportDefinition=6C5992CD-885B-4BDF-BAEE-6D9D8CE31796", {
        "headers": {
          "accept": "*/*",
          "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,fr;q=0.7",
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          "x-requested-with": "XMLHttpRequest",
          "Authorization": "Basic YWRtaW46WTN6NDRBSDI=",
          "Cookie": `JSESSIONID=B486FF4C437CB51226F00533424F04B4;`
        },
        "body": "parameterValues%5BstartDate%5D=2022-08-1&parameterValues%5BendDate%5D=2023-02-1&parameterValues%5Blocation%5D=50&renderingMode=org.openmrs.module.reporting.report.renderer.ExcelTemplateRenderer!987B028A-04C7-45ED-84DF-342A15802F42",
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
      }).then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
    })
    .catch(error => console.log('Session fetch error', error));

  } catch (error) {
    console.error(error.message);
  }
};

const runLoadTest = async (numRequests) => {
  const requests = [];

  // create an array of promises that send the requests
  for (let i = 0; i < numRequests; i++) {
    requests.push(sendRequest());
  }

  // wait for all the promises to resolve
  await Promise.all(requests);
};

// run the load test with 50 concurrent requests
runLoadTest(5);


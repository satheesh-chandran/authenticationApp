const sendCreateAppRequest = function (body) {
  const options = {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body)
  };
  return fetch('/createApp', options).then(res => res.json());
};

const showFieldError = function () {
  const errorElement = document.querySelector('#container p');
  errorElement.classList.remove('invisible');
  setTimeout(() => errorElement.classList.add('invisible'), 1500);
};

const getTexts = function () {
  const properties = ['name', 'homePage', 'description', 'callbackUrl'];
  return properties.reduce((context, prop) => {
    const textElement = document.querySelector(`#${prop}`);
    context[prop] = textElement.value.trim();
    textElement.value = '';
    return context;
  }, {});
};

const getElement = prop => document.querySelector(prop);

const showRegisterInformation = ({ clientId, clientSecret }, appName) => {
  getElement('#appName').innerText = appName;
  getElement('#clientId').innerText = clientId;
  getElement('#clientSecret').innerText = clientSecret;
  getElement('#appInfo').classList.remove('invisible');
  getElement('#container').classList.add('invisible');
};

const submitAppDetails = async function () {
  const texts = getTexts();
  if (!Object.values(texts).every(text => text)) {
    return showFieldError();
  }
  const response = await sendCreateAppRequest(texts);
  showRegisterInformation(response, texts.name);
};

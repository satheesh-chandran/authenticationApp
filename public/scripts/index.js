const sendCreateAppRequest = function (body) {
  const options = {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body)
  };
  fetch('/createApp', options).then(console.log);
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

const submitAppDetails = function () {
  const texts = getTexts();
  if (!Object.values(texts).every(text => text)) {
    return showFieldError();
  }
  sendCreateAppRequest(texts);
};

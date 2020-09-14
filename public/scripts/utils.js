const sendPostRequest = function (url, body) {
  const options = {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body)
  };
  return fetch(url, options).then(res => res.json());
};

const getTexts = properties =>
  properties.reduce((context, prop) => {
    const textElement = document.querySelector(`#${prop}`);
    context[prop] = textElement.value.trim();
    textElement.value = '';
    return context;
  }, {});

const showFieldError = function () {
  const errorElement = document.querySelector('#container p');
  errorElement.classList.remove('invisible');
  setTimeout(() => errorElement.classList.add('invisible'), 1500);
};

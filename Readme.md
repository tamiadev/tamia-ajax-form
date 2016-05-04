# Tâmia Ajax Form

[![Build Status](https://travis-ci.org/tamiadev/tamia-ajax-form.png)](https://travis-ci.org/tamiadev/tamia-ajax-form)

Forms ajaxification for [Tâmia](http://tamiadev.github.io/tamia/).

## Installation

```bash
$ npm install --save-dev tamia-ajax-form
```

## Usage

```javascript

ajaxForm({
  form: formElem,
  url: 'http://example.list-manage.com/subscribe/post',
  type: 'jsonp',
  jsonpCallback: 'c',
  onSuccess: data => {
    console.log('Yep :-)');
    return {
      result: 'success',
    };
  },
  onError: data => {
    console.log('Nope :-(');
    return {
      message: data.message,
    };
  },
});
```

---

## License

The MIT License, see the included [License.md](./License.md) file.

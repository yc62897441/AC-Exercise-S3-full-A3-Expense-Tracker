const handlebars = require('handlebars')

handlebars.registerHelper('compareValues', function (inputValue, optionValue) {
  if (inputValue === optionValue) {
    return 'selected'
  }
})

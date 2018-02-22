// --- [Order Class] ---
class Order {
  constructor(name, email, address, addressTwo, city, state, zip, country, size, color) {
    this.name = name;
    this.email = email;
    this.address = address;
    this.addressTwo = addressTwo;
    this.city = city;
    this.state = state;
    this.zip = zip;
    this.country = country;
    this.size = size;
    this.color = color;
  }

  validOrderObj() {
    return {
      name: this.name.value,
      address: this.address.value,
      addressTwo: this.addressTwo.value,
      city: this.city.value,
      state: this.state.value,
      zip: this.zip.value,
      size: this.size,
      color: this.color
    };
  }

  isFormValid() {
    let validCount = 0;
    validCount += this.name.validity.valid ? 0 : 1;
    validCount += this.name.value.trim().length !== 0 ? 0 : 1;
    validCount += this.email.validity.valid ? 0 : 1;
    validCount += regexEmail(this.email.value.trim()) ? 0 : 1;
    validCount += this.address.validity.valid ? 0 : 1;
    validCount += this.address.value.trim().length !== 0 ? 0 : 1;
    validCount += this.city.validity.valid ? 0 : 1;
    validCount += this.city.value.trim().length !== 0 ? 0 : 1;
    validCount += this.state.validity.valid ? 0 : 1;
    validCount += this.state.value.trim().length !== 0 ? 0 : 1;
    validCount += this.zip.validity.valid ? 0 : 1;
    validCount += regexZip(this.zip.value.trim()) ? 0 : 1;
    validCount += this.country.validity.valid ? 0 : 1;
    validCount += this.country.value.trim().length !== 0 ? 0 : 1;
    return validCount;
  }

  isSizeValid() { return !!this.size ? 0 : 1; }
  isColorValid() { return !!this.color ? 0 : 1; }
}


// --- [Page Listeners] ---
// Site Loaded
document.addEventListener("DOMContentLoaded", () => {

  // load states into select box
  const stateSelect = document.querySelector('#state');
  usStates.map(x => stateSelect.options[stateSelect.options.length] = new Option(x, x));

  // load countries
  const countrySelect = document.querySelector('#country');
  worldCountries.map(x => countrySelect.options[countrySelect.options.length] = new Option(x, x));
});


// --- [Product Listeners] ---
// size choice
// small
document.querySelector('#btn-small').addEventListener('click', e => {
  selectedOutline(e.target, 0);
  selectedSize('small', 'S');
  checkFormValidity();
});

// medium
document.querySelector('#btn-medium').addEventListener('click', e => {
  selectedOutline(e.target, 0);
  selectedSize('medium', 'M');
  checkFormValidity();
});

// large 
document.querySelector('#btn-large').addEventListener('click', e => {
  selectedOutline(e.target, 0);
  selectedSize('large', 'L');
  checkFormValidity();
});

// update picture and change summary
const selectedSize = (target, val) => {

  document.querySelector(`.${target}`).classList.add('show');

  const imgs = ['small', 'medium', 'large'];
  imgs.map(x => {
    if (x !== target) document.querySelector(`.${x}`).classList.remove('show');
  });

  document.querySelector('#summary-size').textContent = val;
};


// color choice
// green
document.querySelector('#btn-green').addEventListener('click', e => {
  selectedOutline(e.target, 1);
  selectedColor('Green');
  checkFormValidity();
});

// red
document.querySelector('#btn-red').addEventListener('click', e => {
  selectedOutline(e.target, 1);
  selectedColor('Red');
  checkFormValidity();
});

// black
document.querySelector('#btn-black').addEventListener('click', e => {
  selectedOutline(e.target, 1);
  selectedColor('Black');
  checkFormValidity();
});

// blue
document.querySelector('#btn-blue').addEventListener('click', e => {
  selectedOutline(e.target, 1);
  selectedColor('Blue');
  checkFormValidity();
});

// selected color
const selectedColor = val => document.querySelector('#summary-color').textContent = val;

// add selected class and remove from previous
const selectedOutline = (target, type) => {

  target.classList.add('selected');

  const sizes = ['btn-small', 'btn-medium', 'btn-large'];
  const colors = ['btn-green', 'btn-red', 'btn-black', 'btn-blue'];

  let btns = type === 0 ? sizes : colors;
  btns.map(x => {
    if (x !== target.id) document.querySelector(`#${x}`).classList.remove('selected');
  });
};


// --- [Order Validators] ---
// check form validity
const checkFormValidity = () => {

  // form
  const form = document.forms.orderForm;

  // new Order
  const orderForm = new Order();
  orderForm.name = form.name;
  orderForm.email = form.email;
  orderForm.address = form.address;
  orderForm.addressTwo = form.addressTwo;
  orderForm.city = form.city;
  orderForm.state = form.state;
  orderForm.zip = form.zip;
  orderForm.country = form.country;
  orderForm.size = document.querySelector('#summary-size').textContent;
  orderForm.color = document.querySelector('#summary-color').textContent;

  // valid form input count
  const formCount = orderForm.isFormValid();
  const sizeValid = orderForm.isSizeValid();
  const colorValid = orderForm.isColorValid();
  const validTotal = formCount + sizeValid + colorValid;

  // Size and Color errors
  let errSize = document.querySelector('#err-size');
  let errColor = document.querySelector('#err-color');
  if (!formCount && sizeValid) errSize.textContent = 'Missing product size';
  else errSize.textContent = '';
  if (!formCount && colorValid) errColor.textContent = 'Missing product color';
  else errColor.textContent = '';

  // toggle submit disabled and store valid form object
  if (!validTotal) {
    toggleCompleteBtn(false);
    setValidOrder(orderForm.validOrderObj());
  } else toggleCompleteBtn(true);
};

// toggle complete button and save valid order locally
const toggleCompleteBtn = val => document.querySelector('#submit').disabled = val;
const setValidOrder = val => localStorage.setItem('validOrder', JSON.stringify(val));

// regex for email and zip validation
const regexEmail = val => /^[A-Za-z0-9._]+@[A-Za-z]+\.[A-Za-z.]{2,5}$/.test(val);
const regexZip = val => /^\d{5}(?:[-\s]\d{4})?$/.test(val);


// -- [Form Updates] ---
// keyup
const keyup = (val, type) => {

  // update summary text
  if (val) document.querySelector(`#summary-${type}`).textContent = val;
  checkFormValidity();
};

// keydown
const keydown = (val, key, type) => {

  // update summary text
  const summaryValue = document.querySelector(`#summary-${type}`);
  if (val && key === 8 && val.length === 1) summaryValue.textContent = '';
  else if (val) summaryValue.textContent = val;
  checkFormValidity();
};

// check input validity
const blur = (val, type) => {

  // check val and add any erros
  const error = document.querySelector(`#err-${type}`);
  if (!val.length) error.textContent = `${type} required`;
  else if (type === 'email' && !regexEmail(val)) error.textContent = 'Incorrect email format';
  else if (type === 'zip' && !regexZip(val)) error.textContent = 'Incorrect zip format';
  else error.textContent = '';
  checkFormValidity();
};


// --- [Input Listeners] ---
// name
const name = document.querySelector('#name');
name.addEventListener('keyup', e => keyup(e.target.value.trim(), 'name'));
name.addEventListener('keydown', e => keydown(e.target.value.trim(), e.keyCode, 'name'));
name.addEventListener('blur', e => blur(e.target.value.trim(), 'name'));

// email
const email = document.querySelector('#email');
email.addEventListener('blur', e => blur(e.target.value.trim(), 'email'));

// address
const address = document.querySelector('#address');
address.addEventListener('keyup', e => keyup(e.target.value.trim(), 'address'));
address.addEventListener('keydown', e => keydown(e.target.value.trim(), e.keyCode, 'address'));
address.addEventListener('blur', e => blur(e.target.value.trim(), 'address'));

// address 2
const addressTwo = document.querySelector('#addressTwo');
addressTwo.addEventListener('keyup', e => keyup(e.target.value.trim(), 'addressTwo'));
addressTwo.addEventListener('keydown', e => keydown(e.target.value.trim(), e.keyCode, 'addressTwo'));

// city
const city = document.querySelector('#city');
city.addEventListener('keyup', e => keyup(e.target.value.trim(), 'city'));
city.addEventListener('keydown', e => keydown(e.target.value.trim(), e.keyCode, 'city'));
city.addEventListener('blur', e => blur(e.target.value.trim(), 'city'));

// state
const state = document.querySelector('#state');
state.addEventListener('change', e => {
  const state = e.target.value.trim();
  keyup(state, 'state');
  blur(state, 'state');
});
state.addEventListener('blur', e => blur(e.target.value.trim(), 'state'));

// zip
const zip = document.querySelector('#zip');
zip.addEventListener('keyup', e => keyup(e.target.value.trim(), 'zip'));
zip.addEventListener('keydown', e => keydown(e.target.value.trim(), e.keyCode, 'zip'));
zip.addEventListener('blur', e => blur(e.target.value.trim(), 'zip'));

// country
const country = document.querySelector('#country');
country.addEventListener('change', e => blur(e.target.value.trim(), 'country'));
country.addEventListener('blur', e => blur(e.target.value.trim(), 'country'));

// complete order
document.querySelector('#submit').addEventListener('click', e => {
  e.preventDefault();
  setComplete(JSON.parse(localStorage.getItem('validOrder')));
});


// set complete summary details
const setComplete = val => {

  // hide form sections and show complete 
  const sections = ['product', 'shipping', 'summary'];
  sections.map(x => document.querySelector(`.${x}`).classList.add('hide'));
  document.querySelector('.complete').classList.remove('hide');

  // update complete form 
  Object.keys(val).map(x => document.querySelector(`#summary-${x}2`).textContent = val[x]);
};


// --- [States and Countries] ---
const usStates = ["", "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "District Of Columbia", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"];
const worldCountries = ["", "Afghanistan", "Albania", "Algeria", "American Samoa", "Andorra", "Angola", "Anguilla", "Antarctica", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia and Herzegowina", "Botswana", "Bouvet Island", "Brazil", "British Indian Ocean Territory", "Brunei Darussalam", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Central African Republic", "Chad", "Chile", "China", "Christmas Island", "Cocos (Keeling) Islands", "Colombia", "Comoros", "Congo", "Congo, the Democratic Republic of the", "Cook Islands", "Costa Rica", "Cote d'Ivoire", "Croatia (Hrvatska)", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Falkland Islands (Malvinas)", "Faroe Islands", "Fiji", "Finland", "France", "France Metropolitan", "French Guiana", "French Polynesia", "French Southern Territories", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Heard and Mc Donald Islands", "Holy See (Vatican City State)", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran (Islamic Republic of)", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, Democratic People's Republic of", "Korea, Republic of", "Kuwait", "Kyrgyzstan", "Lao, People's Democratic Republic", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libyan Arab Jamahiriya", "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Macedonia, The Former Yugoslav Republic of", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Martinique", "Mauritania", "Mauritius", "Mayotte", "Mexico", "Micronesia, Federated States of", "Moldova, Republic of", "Monaco", "Mongolia", "Montserrat", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue", "Norfolk Island", "Northern Mariana Islands", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Pitcairn", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russian Federation", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Seychelles", "Sierra Leone", "Singapore", "Slovakia (Slovak Republic)", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Georgia and the South Sandwich Islands", "Spain", "Sri Lanka", "St. Helena", "St. Pierre and Miquelon", "Sudan", "Suriname", "Svalbard and Jan Mayen Islands", "Swaziland", "Sweden", "Switzerland", "Syrian Arab Republic", "Taiwan, Province of China", "Tajikistan", "Tanzania, United Republic of", "Thailand", "Togo", "Tokelau", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks and Caicos Islands", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "United States Minor Outlying Islands", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Virgin Islands (British)", "Virgin Islands (U.S.)", "Wallis and Futuna Islands", "Western Sahara", "Yemen", "Yugoslavia", "Zambia", "Zimbabwe"];

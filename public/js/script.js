const nav = document.querySelector('.nav-look');
const menu = document.querySelector('.menu');
const sectionHow = document.querySelector('.section-how');
const formBtnLogin = document.querySelector('.form-backend_btn--login');
const formBtnSignup = document.querySelector('.form-backend_btn--signup');
const formBtnDelete = document.querySelector('.form-backend_btn--delete');
const formBtnForgetPassword = document.querySelector(
  '.form-backend_btn--forgetPassword'
);
const formBtnSettings = document.querySelector('.form-backend_btn--settings');
const formBtnPassword = document.querySelector('.form-backend_btn--password');
const formBtnResetPassword = document.querySelector(
  '.form-backend_btn--resetPassword'
);
const formLogin = document.querySelector('.form-backend--login');
const formSignup = document.querySelector('.form-backend--signup');
const formDelete = document.querySelector('.form-backend--delete');
const formResetPassword = document.querySelector(
  '.form-backend--resetPassword'
);
const formForgetPassword = document.querySelector(
  '.form-backend--forgetPassword'
);
const formSettings = document.querySelector('.profile__form--settings');
const formPassword = document.querySelector('.profile__form--password');
const email = document.getElementById('email');
const city = document.getElementById('city');
const title = document.getElementById('title');
const street = document.getElementById('street');
const category = document.getElementById('category');
const rentType = document.getElementById('rentType');
const identity = document.getElementById('identity');
const telephone = document.getElementById('telephone');
const description = document.getElementById('description');
const parking = document.getElementById('parking');
const deposit = document.getElementById('deposit');
const availableTo = document.getElementById('availableTo');
const availableFrom = document.getElementById('availableFrom');
const rentPerMonth = document.getElementById('rentPerMonth');
const utilityCosts = document.getElementById('utilityCosts');
const password = document.getElementById('password');
const passwordConfirm = document.getElementById('passwordConfirm');
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const currentPassword = document.getElementById('currentPassword');
const body = document.querySelector('.body');
const createAdForm = document.querySelector('.createAd__form');
const createAd2Form = document.querySelector('.createAd2__form');

const showAlert = function (status, msg, url) {
  const alertDiv = document.createElement('div');
  if (status === 'success') {
    alertDiv.className = 'alert-success';
    alertDiv.innerText = msg;
    setTimeout(() => {
      location.assign(url);
    }, 2000);
  }
  if (status === 'fail') {
    alertDiv.className = 'alert-fail';
    alertDiv.innerText = msg;
    setTimeout(() => {
      alertDiv.closest('.body').removeChild(alertDiv);
    }, 2000);
  }
  body.insertAdjacentElement('afterbegin', alertDiv);
};

const howCb = function (entries, observe) {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    nav.classList.add('showNav');
  } else {
    nav.classList.remove('showNav');
  }
};
const howOptions = {
  root: null,
  threshold: 0,
};

const sectionObserver = new IntersectionObserver(howCb, howOptions);
sectionObserver.observe(menu);

// const headerCallback = function (entries, observer) {
//     const [entry] = entries;

//     if (!entry.isIntersecting) {
//       nav.classList.add("sticky");
//     } else {
//       nav.classList.remove("sticky");
//     }
//   };

//   const headerOptions = {
//     root: null,
//     threshold: 0,
//     rootMargin: "-70px",
//   };

//   const headerObserving = new IntersectionObserver(headerCallback, headerOptions);
//   headerObserving.observe(header);

formLogin?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = { email: email.value, password: password.value };

  formBtnLogin.innerText = '...wait';
  const res = await fetch('http://127.0.0.1:8000/api/v1/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  formBtnLogin.innerText = 'Login';
  const response = await res.json();

  if (response.status === 'success') {
    showAlert('success', 'login successfully', '/');
  }
  if (response.status === 'fail') {
    showAlert('fail', response.message);
  }
});

formSignup?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = {
    email: email.value,
    password: password.value,
    passwordConfirm: passwordConfirm.value,
    title: title.value,
    firstName: firstName.value,
    lastName: lastName.value,
  };
  formBtnSignup.innerText = '..wait';
  const res = await fetch('http://127.0.0.1:8000/api/v1/users/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  formBtnSignup.innerText = 'Next';
  const response = await res.json();

  if (response.status === 'success') {
    showAlert('success', 'signed up successfully', '/');
  }
  if (response.status === 'fail') {
    showAlert('fail', response.message);
  }
});

formForgetPassword?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = {
    email: email.value,
  };
  formBtnForgetPassword.innerText = '..wait';
  const res = await fetch('http://127.0.0.1:8000/api/v1/users/forgotPassword', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  formBtnForgetPassword.innerText = 'Next';
  const response = await res.json();

  if (response.status === 'success') {
    showAlert('success', 'Please check your inbox to reset your password', '/');
  }
  if (response.status === 'fail') {
    showAlert('fail', response.message);
  }
});

formResetPassword?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const token = window.location.href.split('/')[
    window.location.href.split('/').length - 1
  ];

  const data = {
    password: password.value,
    passwordConfirm: passwordConfirm.value,
  };
  formBtnResetPassword.innerText = '..wait';
  const res = await fetch(
    `http://127.0.0.1:8000/api/v1/users/resetPassword/${token}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }
  );
  formBtnResetPassword.innerText = 'Next';
  const response = await res.json();

  if (response.status === 'success') {
    showAlert('success', 'your password is updated', '/');
  }
  if (response.status === 'fail') {
    showAlert('fail', response.message);
  }
});

formSettings?.addEventListener('submit', async (e) => {
  e.preventDefault();
  console.log(document.getElementById('upload-photo__input').files[0]);
  const formData = new FormData();

  formData.append('title', title.value);
  formData.append('email', email.value);
  formData.append('firstName', firstName.value);
  formData.append('lastName', lastName.value);
  formData.append(
    'photo',
    document.getElementById('upload-photo__input').files[0]
  );

  // const data = {
  //   title: title.value,
  //   email: email.value,
  //   firstName: firstName.value,
  //   lastName: lastName.value,
  // };

  formBtnSettings.innerText = '...Please wait';
  const res = await fetch(`http://127.0.0.1:8000/api/v1/users/updateMe`, {
    method: 'PATCH',
    body: formData,
  });
  console.log(res);
  formBtnSettings.innerText = 'Next';
  const response = await res.json();
  console.log(response);
  if (response.status === 'success') {
    showAlert('success', 'Your settings are updated', '/myProfile');
  }
  if (response.status === 'fail') {
    showAlert('fail', response.message);
  }
});

formPassword?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = {
    currentPassword: currentPassword.value,
    password: password.value,
    passwordConfirm: passwordConfirm.value,
  };
  formBtnSettings.innerText = '...Please wait';
  const res = await fetch(`http://127.0.0.1:8000/api/v1/users/updatePassword`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  formBtnSettings.innerText = 'Next';
  const response = await res.json();

  if (response.status === 'success') {
    showAlert('success', 'Your password is updated', '/myProfile');
  }
  if (response.status === 'fail') {
    showAlert('fail', response.message);
  }
});

formDelete?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = {
    password: password.value,
  };
  formBtnDelete.innerText = '...Please wait';
  const res = await fetch(`http://127.0.0.1:8000/api/v1/users/deleteMe`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  formBtnDelete.innerText = 'DELETE MY ACCOUNT';
  const response = await res.json();

  if (response.status === 'success') {
    showAlert('success', 'Your account is deleted', '/');
  }
  if (response.status === 'fail') {
    showAlert('fail', response.message);
  }
});

document.querySelector('.btn--logout')?.addEventListener('click', async () => {
  console.log('h bro again');
  const res = await fetch(`http://127.0.0.1:8000/api/v1/users/logout`, {
    method: 'GET',
  });
  const response = await res.json();
  console.log(response);
  if (response.status === 'success') {
    location.assign('/');
  }
});

let files = [];
document
  .getElementById('uploader')
  ?.addEventListener('input', async function (e) {
    const formData = new FormData();

    formData.append('photo', this.files[0]);

    files.push(this.files[0]);

    const res = await fetch(`http://127.0.0.1:8000/api/v1/users/uploading`, {
      method: 'POST',
      body: formData,
    });

    const response = await res.json();

    const markup = await `<figure class="images-uploader__photoBox images-uploader__photoBox--photo">
      <button type="button" class="images-uploader__photoBox--delete">delete</button>
      <img src="/img/users/${response.data}" alt="" class="images-uploader__img">
    </figure>`;
    await document
      .querySelector('.images-uploader')
      .insertAdjacentHTML('afterbegin', markup);
  });
createAdForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const imageCover = files[0];
  const images = files.slice(1);
  // console.log(imageCover, 'imageCover');
  // console.log(images, 'images');
  const formData = new FormData();

  formData.set('title', title.value);
  formData.set('city', city.value);
  formData.set('category', category.value);
  formData.set('rentType', rentType.value);
  formData.set('district', district.value);
  formData.set('houseNumber', houseNumber.value);
  formData.set('postalCode', postalCode.value);
  formData.set('availableFrom', availableFrom.value);
  formData.set('availableTo', availableTo.value);
  formData.set('propertyType', propertyType.value);
  formData.set('size', size.value);
  formData.set('floorLevel', floorLevel.value);
  formData.set('parking', parking.value);
  formData.set('rentPerMonth', rentPerMonth.value);
  formData.set('deposit', deposit.value);
  formData.set(
    'adresse',
    `${street.value}, ${houseNumber.value}, ${district.value}, ${city.value}, ${postalCode.value}`
  );

  formData.set('telephone', telephone.value);
  formData.set('description', description.value);
  formData.set('identity', identity.value);
  formData.set('utilityCosts', utilityCosts.value);
  formData.set('imageCover', imageCover);
  images.forEach((img, i) => formData.set(`images-${i + 1}`, img));

  const res = await fetch('http://127.0.0.1:8000/api/v1/ads', {
    method: 'POST',
    body: formData,
  });
  const response = await res.json();
  console.log(response);
  if (response.status === 'success') {
    showAlert('success', 'you ad uploaded successfully', '/myads');
  }
  if (response.status === 'fail') {
    showAlert('fail', response.message);
  }
});

document
  .querySelector('.profile__list')
  ?.addEventListener('click', async function (e) {
    await this.childNodes.forEach((f) =>
      f.childNodes[0].classList.remove('profile--active')
    );
    e.target.classList.add('profile--active');
    // this.classList.remove('profile--active');
    // e.currentTarget.classList.add('profile--active');
  });

const sliderBtnLeft = document.querySelector('.chevron--left');
const sliderBtnRight = document.querySelector('.chevron--right');
const chevrons = Array.from(document.querySelectorAll('.myAd__figure--image'));

let counter = 0;
sliderBtnRight?.addEventListener('click', (e) => {
  ++counter;
  if (counter === 4) counter = 0;

  chevrons.forEach((l, i) => {
    document.querySelector(
      `.myAd__figure--image--${i + 1}`
    ).style.transform = `translateX(${(i - counter) * 100}%)`;
  });

  // document.querySelector(
  //   `.myAd__figure--image--1`
  // ).style.transform = `translateX(${(0 - counter) * 100}%)`;
  // document.querySelector(
  //   `.myAd__figure--image--2`
  // ).style.transform = `translateX(${(1 - counter) * 100}%)`;
  // document.querySelector(
  //   `.myAd__figure--image--3`
  // ).style.transform = `translateX(${(2 - counter) * 100}%)`;
  // document.querySelector(
  //   `.myAd__figure--image--4`
  // ).style.transform = `translateX(${(3 - counter) * 100}%)`;
});
sliderBtnLeft?.addEventListener('click', (e) => {
  --counter;
  if (counter < 0) counter = chevrons.length - 1;

  chevrons.forEach((l, i) => {
    document.querySelector(
      `.myAd__figure--image--${i + 1}`
    ).style.transform = `translateX(${(i - counter) * 100}%)`;
  });
});

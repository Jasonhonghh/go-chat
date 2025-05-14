// Password login
async function loginWithPassword() {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: 'your_username',
      password: 'your_password'
    })
  });
  
  const data = await response.json();
  localStorage.setItem('token', data.token);
  localStorage.setItem('userId', data.userId);
  
  return data;
}

// SMS verification login
async function loginWithSMS() {
  // Step 1: Request verification code
  await fetch('/api/send_sms_code', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      phone: 'your_phone_number',
      type: 'login'
    })
  });
  
  // Step 2: Login with the code (after receiving it)
  const response = await fetch('/api/sms_login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      phone: 'your_phone_number',
      smsCode: 'verification_code'
    })
  });
  
  const data = await response.json();
  localStorage.setItem('token', data.token);
  localStorage.setItem('userId', data.userId);
  
  return data;
}
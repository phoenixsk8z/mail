document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function compose_email_post() {
  // Get values and send them to the server
  var recipients = document.getElementById('compose-recipients').value;
  var subject_email = document.getElementById('compose-subject').value;
  var body_email = document.getElementById('compose-body').value;
  var params = 'recipients=recipients&subject=subject_email&body=body_email';
  var xhr = new XMLHttpRequest();
  xhr.open("POST", 'emails', true);

  /*
  var params = new Object();
  params.recipients = recipients;
  params.subject = subject_email;
  params.body = body_email;
  
  alert(params.recipients);

  xhr.onreadystatechange = function() {//Call a function when the state changes.
    if(http.readyState == 4 && http.status == 200) {
        alert(http.responseText);
    }
  }

  alert("broken")

  let urlEncodedData = "", urlEncodedDataPairs = [], name;
  for( name in params ) {
    urlEncodedDataPairs.push(encodedURIComponent(name)+'='+encodeURIComponent(params[name]));
  }
  */
  xhr.setRequestHeader('accept', 'application/json');
  xhr.send(params);

  /*
  fetch(userRequest)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    })
    .catch(function (err) {
      console.log("Something went wrong!", err);
    })
  */
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
}

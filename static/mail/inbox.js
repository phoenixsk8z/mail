document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox-nav').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent-nav').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived-nav').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose-nav').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'grid';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
};

function compose_email_post() {
  // Get values and send them to the server
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: document.getElementById('compose-recipients').value,
      subject: document.getElementById('compose-subject').value,
      body: document.getElementById('compose-body').value
    })
  })
  .then((response) => response.json())
  .then(result => {
    console.log(result);
    if (result.status == 201) {
      load_mailbox("sent");
    } else {
      `<div class="alert alert-danger" role="alert">
      ${result.error}</div>`;
    }
  });
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'grid';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  var email_view = document.querySelector('#emails-view');

  if (mailbox == "show_mail") {
    show_mail();
    return;
  }
  fetch(`/emails/${mailbox}`)
  .then((response) => response.json())
  .then((emails) => {
    emails.forEach((element) => {
    if (mailbox == "sent") {
      sender_recipients = element.recipients;
    } else {
      sender_recipients = element.sender;
    }

    if (mailbox == "inbox") {
      if (element.read) is_read = "Read";
      else is_read = "";
    } else is_read = "";

    var email = document.createElement("div");

    email.className = `inbox-email ${is_read}`;
    email.className = "email-div";

    email.innerHTML = `<div class="email" id="email-${element.id}">
    ${element.subject} | ${sender_recipients} | ${element.timestamp} 
    <br> ${element.body.slice(0,100)}
    </div>`;
    document.querySelector("#emails-view").appendChild(email);
    email.addEventListener("click", () => {
      show_mail(element.id, mailbox);
    });
  });
});
}

function show_mail(id, mailbox) {
  fetch(`/emails/${id}`)
  .then((response) => response.json())
  .then((email) => {
    document.querySelector("#emails-view").innerHTML = "";
    var email_body = document.createElement("div");
    email_body.className = `email_div`;

    email_body.innerHTML = `<div class="email_body" style="white-space: pre-wrap;">
    Sender: ${email.sender}
    Recipients: ${email.recipients}
    Subject: ${email.subject}
    Time: ${email.timestamp}
    <br>: ${email.body}
    </div>`;

    document.querySelector('#emails-view').appendChild(email_body);
    if (mailbox == "sent") return;
    let archive = document.createElement("btn");
    archive.className = `Achrive-btn`;
    archive.addEventListener("click", () => {
      toggle_archive(id, email.archived);
      if (archive.innerText == "Archive") archive.innerText = "Unarchive";
      else archive.innerText = "Archive"
    })
    if (!email.archived) archive.textContent = "Archive";
    else archive.innerText = "Unarchive";
    document.querySelector("#emails-view").appendChild(archive);

    let reply = document.createElement("btn");
    reply.className = `Reply-btn`;
    reply.textContent = "Reply";
    reply.addEventListener("click", () => {
      reply_mail(email.sender, email.subject, email.body, email.timestamp);
    });
    document.querySelector("#emails-view").appendChild(reply);
    make_read(id);
    });
};

function toggle_archive(id, state) {
  fetch(`/emails/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      archived: !state,
    }),
  });
}

function make_read(id) {
  fetch(`/emails/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      read: true,
    }),
  });
}

function reply_mail(sender, subject, body, timestamp) {
  compose_email();
  if (!/^Re:/.test(subject)) subject = `Re: ${subject}`;
  document.querySelector("#compose-recipients").value = sender;
  document.querySelector("#compose-subject").value = subject;

  pre_fill = `On ${timestamp} ${sender} wrote:\n${body}\n`;

  document.querySelector("#compose-body").value = pre_fill;
}
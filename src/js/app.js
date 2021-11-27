import { from, interval, of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { catchError, concatMap, pluck } from 'rxjs/operators';

function getMessageEl(messageObj) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');

  let messageSubject = messageObj.subject;
  if (messageSubject.length > 15) {
    messageSubject = `${messageSubject.slice(0, 15)}...`;
  }

  const received = new Date(messageObj.received);
  const receivedTime = received.toLocaleString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const receivedDate = received.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });

  messageElement.innerHTML = `
    <div class="name-wrapper">
      ${messageObj.from}
    </div>
    <div class="subject-wrapper">
      ${messageSubject}
    </div>
    <div class="date-wrapper">
      ${receivedTime} ${receivedDate}
    </div>
  `;

  return messageElement;
}

const messageContainer = document.querySelector('div.incoming-massages');

const unread$ = interval(3000).pipe(
  concatMap(
    () => from(ajax.getJSON('https://lap-heroku-rxjs.herokuapp.com/messages/unread'))
      .pipe(catchError(() => of({ messages: [] }))),
  ),
  pluck('messages'),
);

unread$.subscribe({
  next: (messages) => {
    for (const message of messages) {
      messageContainer.prepend(getMessageEl(message));
    }
  },
});

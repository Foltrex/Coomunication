import SockJS from 'sockjs-client';
import {over} from 'stompjs';


export function register(registrations) {
    const socket = new SockJS('http://localhost:8080/ws');
    const stompClient = over(socket);
	stompClient.connect({}, function(frame) {
        console.log('Connected: ' + frame);
		registrations.forEach(function (registration) {
			console.log(registration)
			stompClient.subscribe(registration.route, registration.callback);
		});
	}, (err) => { console.log(err); });

	return stompClient;
}
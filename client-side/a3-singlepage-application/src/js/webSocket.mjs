// static webSocket
// main usage to be seperated from the rest of the code
// and to avoid caching msgs multiple times if more than one component is listening to the webSocket

const webSocket = {
    
  // static webSocket
	ws: null,
	listeners: [],

	/**
	 * start the webSocket and add listener to the listeners array
	 * 
	 * @param {Chatt} listener 
	 * @returns {WebSocket} the websocket
	 */
	init: function(listener) {
		if (this.ws === null) {
			this.ws = new WebSocket("wss://courselab.lnu.se/message-app/socket")
		
		
			this.ws.addEventListener("message", (e) => {
				if (JSON.parse(e.data).username === 'The Server' ||
						JSON.parse(e.data).username === 'Server') return

				this.cacheMsgs([JSON.parse(e.data).username, JSON.parse(e.data).data, JSON.parse(e.data).channel])
				this.notify(e)

			})

			this.ws.addEventListener("close", () => {
				this.ws = null
				this.listeners = []

			})

		}

		this.listeners.push(listener)

		// add cached messages to the listener
		listener.readCahsedMsgs("General")
		return this.ws;
	},


	/**
	 * remove listener from the listeners array
	 * and closes the socket if no more listeners are listening
	 */
	remove: function(listener) {
		this.listeners.pop(listener)
		if (this.listeners.length === 0) {
			this.ws.close()
		}
	},


	/**
	 * notify all listeners of a new message
	 */
	notify: function(message) {
		this.listeners.forEach(listener => {
			listener.newMsg(message)
		})
	},


	/**
	 * cache the message in local storage
	 */
	cacheMsgs: function(msg) {

		let msgs = JSON.parse(localStorage.getItem('Any'))
		let msgs2 = null

		if (msg[2] === 'General' || msg[2] === 'Encrypted' || msg[2] === 'general' || msg[2] === 'encrypted') {
			msgs2 = JSON.parse(localStorage.getItem(msg[2]))
			if (msgs2 === null) {
				msgs2 = []
			} 
			msgs2.push({ username: msg[0], msg: msg[1], time: new Date().toLocaleTimeString() })

			while (msgs2.length > 30) {
				msgs2.shift()
			}
			localStorage.setItem(msg[2], JSON.stringify(msgs2))
			
		}

		if (msgs === null) {
			msgs = []
		}

		msgs.push({ username: msg[0], msg: msg[1], time: new Date().toLocaleTimeString(), channel: msg[2] })

		while (msgs.length > 30) {
			msgs.shift()
		}

		localStorage.setItem('Any', JSON.stringify(msgs))
	
	},


}

export default webSocket;

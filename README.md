Cfnc
---

Just kidding.

# Install
1. Clone repository from GitHub:
`git clone git@github.com:Kern0/Cfnc.git`
2. Install modules
`npm install`

# Usage
1. Start the server:
`node kdeploy.js`
2. Configure the server in `config.js`:
```JavaScript
module.exports = {
	port: process.env.PORT || 80,
	
	twitter_oauth: {
		consumer_key: '',
		consumer_secret: '',
		token: '',
		token_secret: ''
	}
};
```
Also see `config.example.js` file.
3. Recieve output at /confluence
4. ???
5. PROFIT
6. Or get error in response JSON.

# Author
Kern0 — [Home page](http://kern0.ru), [GitHub](https://github.com/Kern0/KtulhuDeploy).
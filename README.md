# Orienteering Cloud Data Hub

We will be using [Node.js](https://nodejs.org/) v18.12.1.
New JavaScript features (ES2015) are "enabled" for for all modern browsers with [Babel](https://babeljs.io/).

## NodeJS Express

- **[Express docs](https://expressjs.com/en/starter/hello-world.html)**

## Local development

```bash
Create backend/.env from the template in backend/.env.example and fill in the credentials to your database and keys to 3rd party.
npm install
npx prisma migrate dev
npx prisma db seed
npm run start:dev
```

## Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

1. Create your feature branch: `git checkout -b Feature/my-new-feature`
2. Commit your changes: `git commit -am 'Add some feature'`
3. Push to the branch: `git push origin Feature/my-new-feature`
4. Submit a pull request :D

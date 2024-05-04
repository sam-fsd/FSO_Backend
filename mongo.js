const mongoose = require('mongoose');

const password = process.argv[2];
const name = process.argv[3];
const phoneNumber = process.argv[4];

const DBURL = `mongodb+srv://root:${password}@fso.jwrnht8.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=FSO`;

mongoose.set('strictQuery', false);
mongoose.connect(DBURL);

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', contactSchema);

const person = new Person({
  name,
  number: phoneNumber,
});

if (name && phoneNumber) {
  person.save().then((result) => {
    console.log(`added ${name} number ${phoneNumber} to phonebook`);
    mongoose.connection.close();
  });
} else {
  Person.find({}).then((results) => {
    console.log('phonebook:');
    results.forEach((result) => {
      console.log(`${result.name} ${result.number}`);
    });
    mongoose.connection.close();
  });
}

const express = require('express')

const cors = require('cors')
const jwt = require('jsonwebtoken')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
require('dotenv').config()

const app = express()

const port = process.env.PORT || 8000

// middlewares
app.use(cors())
app.use(express.json())

// Database Connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1vci1qk.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    const noticeDetails = client.db('RoseGarden').collection('noticeDetails')
    const usersCollection = client.db('RoseGarden').collection('Users')
    const AddRoutine = client.db('RoseGarden').collection('Routine')
    const Admissions = client.db('RoseGarden').collection('Admissions')
    const Teachers = client.db('RoseGarden').collection('teacher')
    const libraryDetails = client.db('RoseGarden').collection('booksDetails')
    const blogDetails = client.db('RoseGarden').collection('blog')
    const admitCard = client.db('RoseGarden').collection('admitCard')
    const ExamResult = client.db('RoseGarden').collection('ExamResult')

    // app.put('/user/:email', async (req, res) => {
    //   const email = req.params.email
    //   const user = req.body
    //   const filter = { email: email }
    //   const options = { upsert: true }
    //   const updateDoc = {
    //     $set: user,
    //   }
    //   const result = await usersCollection.updateOne(filter, updateDoc, options)
    //   console.log(result);

    //   const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    //     expiresIn: '1d',

    //   })
    //   console.log(token);
    //   res.send({ result, token })
    // })
    app.post('/users', async (req, res) => {
      const user = req.body;
      console.log(user);
      // TODO: make sure you do not enter duplicate user email
      // only insert users if the user doesn't exist in the database
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    /////////////////USERS ADMIN///////////////
    app.get('/users/admin/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email }
      const user = await usersCollection.findOne(query);
      res.send({ isAdmin: user?.role === 'admin' });
    })
    app.get('/users/teacher/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email }
      const user = await usersCollection.findOne(query);
      res.send({ isTeacher: user?.role === 'teacher' });
    })

    app.get('/users', async (req, res) => {
      const query = {};
      const options = await usersCollection.find(query).toArray();
      res.send(options);
    })

    app.put('/users/admin/:id', async (req, res) => {

      const id = req.params.id;
      const filter = { _id: ObjectId(id) }
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          role: 'admin'
        }
      }
      const result = await usersCollection.updateOne(filter, updatedDoc, options);
      res.send(result);
    });

    app.put('/users/teacher/:id', async (req, res) => {

      const id = req.params.id;
      const filter = { _id: ObjectId(id) }
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          role: 'teacher'
        }
      }
      const result = await usersCollection.updateOne(filter, updatedDoc, options);
      res.send(result);
    });

    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    });

    /////////////////Users End

    app.get('/noticeDetails', async (req, res) => {
      const query = {};
      const options = await noticeDetails.find(query).toArray();
      res.send(options);
    })
    app.get('/noticeDetails/:id', async (req, res) => {
      const id = req.params.id;
      const query = { id: id };
      const result = await noticeDetails.find(query).toArray();
      res.send(result);
    })

    app.post('/addNotice', async (req, res) => {
      const order = req.body;
      const result = await noticeDetails.insertOne(order);
      res.send(result);
    });
    app.delete('/notice/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await noticeDetails.deleteOne(query);
      res.send(result);
    });



    //  routine Start ///////////////////////////////////

    app.get('/addRoutine', async (req, res) => {
      const query = {};
      const options = await AddRoutine.find(query).toArray();
      res.send(options);
    })

    app.post('/addRoutine', async (req, res) => {
      const order = req.body;
      const result = await AddRoutine.insertOne(order);
      res.send(result);
    });

    app.delete('/routine/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await AddRoutine.deleteOne(query);
      res.send(result);
    });
    /////////// Routine End //////////

    /////////// Admission Start //////////
    app.get('/admissions/student/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email }
      const user = await Admissions.findOne(query);
      res.send({ isStudent: user?.role === 'student' });
    })
    app.get('/admissions/:role', async (req, res) => {
      const role = req.params.role;
      const query = { role: role };
      const user = await Admissions.find(query).toArray();
      res.send(user);
    })

    app.get('/admissions/positive/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await Admissions.find(query).toArray();
      res.send(user);
    })

    app.put('/admissions/student/:id', async (req, res) => {

      const id = req.params.id;
      const filter = { _id: ObjectId(id) }
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          role: 'student'
        }
      }
      const result = await Admissions.updateOne(filter, updatedDoc, options);
      res.send(result);
    });

    app.get('/admissions', async (req, res) => {
      const query = {};
      const options = await Admissions.find(query).toArray();
      res.send(options);
    });

    app.post('/admissions', async (req, res) => {
      const order = req.body;
      const result = await Admissions.insertOne(order);
      res.send(result);
    });

    app.get('/admissionss/:id', async (req, res) => {
      const id = req.params.id;
      const query = { id: id };
      const result = await Admissions.find(query).toArray();
      res.send(result);
    })

    app.delete('/admissions/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await Admissions.deleteOne(query);
      res.send(result);
    });

    /////////// Admission End //////////

    ////////////// Add Teacher Start ///////////
    app.get('/addTeacher', async (req, res) => {
      const query = {};
      const options = await Teachers.find(query).toArray();
      res.send(options);
    });

    app.post('/addTeacher', async (req, res) => {
      const order = req.body;
      const result = await Teachers.insertOne(order);
      res.send(result);
    });
    app.delete('/teacher/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await Teachers.deleteOne(query);
      res.send(result);
    });

    ////////////// Add Teacher End ///////////
    //////////////  library start ///////////
    app.get('/libraryDetails', async (req, res) => {
      const query = {};
      const options = await libraryDetails.find(query).toArray();
      res.send(options);
    })
    app.get('/libraryDetails/:id', async (req, res) => {
      const id = req.params.id;
      const query = { id: id };
      const result = await libraryDetails.find(query).toArray();
      res.send(result);
    })
    app.post('/libraryDetails', async (req, res) => {
      const order = req.body;
      const result = await libraryDetails.insertOne(order);
      res.send(result);
    });
    app.delete('/libraryDetails/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await libraryDetails.deleteOne(query);
      res.send(result);
    });
    ////////////// library end ///////////
    ////////////// blog start ///////////
    app.get('/blog', async (req, res) => {
      const query = {};
      const options = await blogDetails.find(query).toArray();
      res.send(options);
    })
    app.get('/blog/:id', async (req, res) => {
      const id = req.params.id;
      const query = { id: id };
      const result = await blogDetails.find(query).toArray();
      res.send(result);
    })
    ////////////// blog end ///////////

    ////////////// admit start ///////////
    app.get('/admitCard', async (req, res) => {
      const query = {};
      const options = await admitCard.find(query).toArray();
      res.send(options);
    })
    app.get('/admitCard/:id', async (req, res) => {
      const id = req.params.id;
      const query = { id: id };
      const result = await admitCard.find(query).toArray();
      res.send(result);
    })
    app.post('/addAdmitCard', async (req, res) => {
      const order = req.body;
      const result = await admitCard.insertOne(order);
      res.send(result);
    });

    // app.delete('/routine/:id', async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: ObjectId(id) };
    //   const result = await AddRoutine.deleteOne(query);
    //   res.send(result);
    // });
    ////////////// admit end ///////////
    ////////////// result start ///////////
    app.get('/ExamResult', async (req, res) => {
      const query = {};
      const options = await ExamResult.find(query).toArray();
      res.send(options);
    })
    app.get('/ExamResults', async (req, res) => {
      const query = {};
      const options = await ExamResult.find(query).toArray();
      res.send(options);
    })
    app.get('/ExamResult/:id', async (req, res) => {
      const id = req.params.id;
      const query = { id: id };
      const result = await ExamResult.find(query).toArray();
      res.send(result);
    })
    app.post('/ExamResult', async (req, res) => {
      const order = req.body;
      const result = await ExamResult.insertOne(order);
      res.send(result);
    });
    app.get('/ExamResults/:exam', async (req, res) => {
      const exam = req.params.exam;
      const query = { exam: exam };
      const result = await ExamResult.find(query).toArray();
      res.send(result);
    })
    ////////////// result end ///////////


    console.log('Database Connected...')
  } finally {
  }
}

run().catch(err => console.error(err))

app.get('/', (req, res) => {
  res.send('Server is running...')
})

app.listen(port, () => {
  console.log(`Server is running...on ${port}`)
})

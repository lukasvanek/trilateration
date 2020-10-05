import mongoose from 'mongoose'
import scan from 'workers/scan'
import Gsrs from 'models/gsrs'
import GsrsActual from 'models/gsrsActual'

import Lctns from 'models/lctns'

import * as R from 'ramda'

const mongoURL = 'mongodb://127.0.0.1:27017/quanti'

mongoose.connect(
  mongoURL,
  {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) throw err
  },
)

//profilesWorker();
//igsrsUpdate();
//bot();
//scan();

const doIt = async (skip, limit) => {
  const all = await GsrsActual.find()
    .sort({ _id: 1 })
    .skip(skip)
    .limit(limit)
    .lean()

  for (const one of all) {
    if (!one.createdAt) {
      GsrsActual.updateOne(
        { _id: one._id },
        {
          createdAt: one.seen,
          updatedAt: one.seen,
        },
      ).then(() => {})
    }
  }

  return all.length
}

const run = async () => {
  let count = 1
  const limit = 1000
  let skip = 0

  while (count > 0) {
    console.log(skip)
    count = await doIt(skip, limit)
    skip = skip + limit
  }
}

run()

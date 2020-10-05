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

const d = new Date()

// Set it to 3 months ago
d.setMonth(d.getMonth() - 3)

const doIt = async (skip, limit) => {
  const all = await Gsrs.find({ createdAt: { $gte: d } })
    .sort({ _id: 1 })
    .skip(skip)
    .limit(limit)
    .lean()

  for (const one of all) {
    await Gsrs.deleteOne({ _id: one._id })
  }

  return all.length
}

const run = async () => {
  let count = 1
  const limit = 2000
  let skip = 0

  while (count > 0) {
    // console.log(skip);
    count = await doIt(skip, limit)
    console.log('count', count)
    skip = skip + limit
  }
  console.log('done')
}

run()

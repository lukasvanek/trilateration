import mongoose from 'mongoose'
import scan from 'workers/scan'
import Gsrs from 'models/gsrs'
import GsrsActual from 'models/gsrsActual'

import Lctns from 'models/lctns'

import * as R from 'ramda'

const mongoURL = 'mongodb://127.0.0.1:27017/quanti'

mongoose.connect(mongoURL, { useNewUrlParser: true }, function (err) {
  if (err) throw err
})

//profilesWorker();
//igsrsUpdate();
//bot();
//scan();

const doIt = async (skip, limit) => {
  const all = await Gsrs.find().sort({ _id: 1 }).skip(skip).limit(limit).lean()

  for (const one of all) {
    await GsrsActual.create(one)
  }

  console.log('batch done')

  return all.length
}

const run = async () => {
  let count = 100
  let skip = 0

  while (count > 0) {
    count = await doIt(skip, 100)
    skip = skip + 100
  }
}

run()

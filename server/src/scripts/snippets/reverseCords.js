import mongoose from 'mongoose'
import scan from 'workers/scan'
import Gsrs from 'models/gsrs'
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

Lctns.find()
  .lean()
  .then((lctns) => {
    lctns.map((l) => {
      let newL = {}

      newL.computedLoc = {
        type: 'Point',
        coordinates: R.reverse(l.computedLoc.coordinates),
      }

      newL.radars = l.radars.map((r) => ({
        ...r,
        coordinates: R.reverse(r.coordinates),
      }))

      Lctns.update({ _id: l._id }, newL, function (err, res) {
        console.log('saved')
      })
    })
  })

import mongoose from 'mongoose'
import config from '../config'

import scan from './workers/scan'
import GsrsHistory from '../features/gsrs/modelHistory'
import GsrsActual from '../features/gsrs/modelActual'
import Lctns from '../features/lctn/model'

// import GsrsActual from 'models/gsrsActual';
// import Lctns from 'models/lctns';
import * as R from 'ramda'

mongoose.connect(
  config.db,
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
scan()

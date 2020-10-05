import mongoose from 'mongoose';
import { drop } from 'ramda';

const LctnsSchema = new mongoose.Schema({
  guid: String,
  radars: [
    {
      coordinates: [Number],
      distance: Number, 
      deviationRange: [Number]
      // deviationRange is empty [] unless distance is approximated
      // otherwise it's possible offset of real distance [min, max]
    }
  ],
  seen: Date, // seen by grindr
  n: { // no. of record of guid in a row
    type: Number,
    default: 1
  },
  last: { // is it the last record of guid?
    type: Boolean,
    default: true
  }, 
  computedLoc: {
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number]
    }
  }
}, {
  timestamps: true
});

LctnsSchema.index({ computedLoc: "2dsphere" })
LctnsSchema.index({ guid: 1 });
LctnsSchema.index({ guid: 1, last: 1 });
LctnsSchema.index({ n: 1 });

const transformDeviationRange = (dR: Number[]) => {
  if (!dR || dR.length < 1) return dR;
  return dR.map(n => n === Infinity ? Number.MAX_SAFE_INTEGER : n);
}

const transformRadars = (radars: any) => {
  return radars.map((r: any) => ({
    ...r,
    deviationRange: transformDeviationRange(r.deviationRange)
  }))
}

/**
 * Statics
 */
LctnsSchema.statics = {
  getMany({ query = {}, limit = 100, sort = {} }): mongoose.Document {
    return this.find(query)
      .limit(limit)
      .sort(sort)
      .lean()
      .execAsync()
      .then((docs: any) => {
        return docs.map((doc: any) => ({
          ...doc,
          radars: transformRadars(doc.radars)
        }))
      });
  }
};

const Lctns = mongoose.model('lctns', LctnsSchema);

export default Lctns;

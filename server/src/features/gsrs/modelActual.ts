import mongoose from 'mongoose'

const GsrsActualSchema = new mongoose.Schema(
  {
    profileId: String,
    displayName: String,
    aboutMe: String,
    age: Number,
    showAge: Boolean,
    ethnicity: Number,
    lookingFor: Array,
    relationshipStatus: Number,
    grindrTribes: Array,
    bodyType: Number,
    hivStatus: Number,
    lastTestedDate: Date,
    height: Number,
    weight: Number,
    socialNetworks: Object,
    instagram: String, // added
    facebook: String, // added
    twitter: String, // added
    showDistance: Boolean,
    profileImageMediaHash: String,
    seen: Date,
    seenLatLng: Array, // added
    usCity: String, // added
    usState: String, // added
    city: String, // added
    country: String, // added
    distance: Number,
    medias: Array,
    identity: Object,
    lastChatTimestamp: Date,

    hasFaceRecognition: Boolean,
    hashtags: Array,
    lastUpdatedTime: Date,
    meetAt: Array,
  },
  { timestamps: true },
)

GsrsActualSchema.index({ profileId: 1 }, { unique: true })
GsrsActualSchema.index({ height: 1 })

const GsrsActual = mongoose.model('actualgsrs', GsrsActualSchema)

export default GsrsActual

import Lctns from './model'
import GsrsActual from '../gsrs/modelActual'

const LctnQueries = {
  lctns: async (_, args) => {
    const d = new Date()

    try {
      const lctns = await Lctns.getMany({
        query: {
          last: true,
          seen: { $gte: d.setHours(d.getHours() - 50) },
        },
        sort: {
          createdAt: -1,
        },
        limit: 1000,
      })

      const populated = await Promise.all(
        lctns.map(async (l: any) => {
          const p = await GsrsActual.findOne({ profileId: l.guid }).lean()
          return {
            ...l,
            profile: p,
          }
        }),
      )

      return populated.filter((l: any) => l.profile.age === 20)
    } catch (err) {
      throw err
    }
  },

  lctnsOfProfile: async (_, { guid }) => {
    const d = new Date()

    try {
      const lctns = await Lctns.getMany({
        query: {
          guid,
        },
        sort: {
          createdAt: 1,
        },
        limit: 10000,
      })

      return lctns
    } catch (err) {
      throw err
    }
  },
}

export { LctnQueries }

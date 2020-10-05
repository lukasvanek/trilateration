import GsrsActual from './modelActual';

const GsrsQueries = {
  profile: async (_, { guid }) => {

    try {
      const profile = await GsrsActual.findOne({ profileId: guid}).lean();
      
      return profile;

    } catch (err) {
      throw err;
    }
  }
};

export { GsrsQueries };

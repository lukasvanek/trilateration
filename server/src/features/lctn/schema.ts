import { gql } from 'apollo-server-express';

export default gql`
  type Radar {
    coordinates: [Float],
    distance: Float,
    deviationRange: [Float]
  }
  type Point {
    type: Point
    coordinates: [Float]
  }
  type Media {
    mediaHash: String
  }
  type Profile {
    profileId: Int
    displayName: String
    aboutMe: String
    medias: [Media]
    profileImageMediaHash: String
    age: Int
  }
  type Lctn {
    guid: String,
    radars: [Radar],

    seen: String,
    n: Int,

    last: Boolean,

    profile: Profile,

    computedLoc: Point   
  }
`;

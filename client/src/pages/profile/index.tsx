import React, { useState, useEffect } from 'react';
import { Map, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import * as R from 'ramda';
import moment from 'moment';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { Box, Button, Text } from 'rebass';
import { Link as RouterLink, useParams } from 'react-router-dom';


const LinkButton = (props: any) =>
  <Button
    {...props}
    as={RouterLink}
  />

const PROFILE = gql`

  query getProfile($guid: String!) {
    profile(guid: $guid) {
      displayName
      profileImageMediaHash
      age
      profileId
      medias {
        mediaHash
      }
      aboutMe
    }
  }

`;

const LCTNS = gql`

  query getLctnsOfProfile($guid: String!) {
    lctnsOfProfile(guid: $guid) {
      computedLoc {
        coordinates
      }
      radars {
        deviationRange
      }
      seen
    }
  }

`;

const ProfilePage = () => {

  const [zoom, setZoom] = useState(13);
  const [position, setPosition] = useState([49.199154, 16.594434] as any);  

  let { guid } = useParams();
  
  const profileRes = useQuery(PROFILE, {
    variables: { guid }
  });
  let profile: any = null;
  if (profileRes.data) {
    profile = profileRes.data.profile;
  }

  const lctns = useQuery(LCTNS, {
    variables: { guid }
  });
  let points: any = [];
  if (lctns.data) {
    points = lctns.data.lctnsOfProfile;
  }

  useEffect(() => {
    const lastPoint: any = R.last(points);
    if (lastPoint) {
      const pos = R.reverse(lastPoint.computedLoc.coordinates);
      setPosition(pos);
    }
  }, [points]);

  return (
    <Box px={[20, 50, 100]}>

      {profile && <Box>
        <Text>{profile.profileId}</Text>
        {profile.medias && profile.medias.map((m: any) => 
          <img key={m.mediaHash} height={200} src={`https://cdns.grindr.com/images/profile/1024x1024/${m.mediaHash}`}></img>
        )}
        <Text>{profile.displayName}, {profile.age}</Text>    
        <Text>{profile.aboutMe}</Text>
      </Box>      
      }

        <Map style={{ height: 600 }} center={position} zoom={zoom}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {<Polyline positions={
            points.map((p: any) => R.reverse(p.computedLoc.coordinates))
          } color={'black'} />}

          {points.map((p: any, i: number) =>
            <Marker
              key={i}
              position={R.reverse(p.computedLoc.coordinates) as any}
              opacity={p.radars[0].deviationRange[0] ? 0.5 : 1}
            >
              <Popup open>
                <div>{moment(Number(p.seen)).fromNow()}</div>
              </Popup>
            </Marker>
          )}

        </Map>


    </Box>
  );
}

export default ProfilePage;

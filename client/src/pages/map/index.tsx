import React, { useState } from 'react';
import { Map, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import * as R from 'ramda';
import moment from 'moment';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { Box, Button } from 'rebass';
import { Link as RouterLink } from 'react-router-dom';


const LinkButton = (props: any) =>
  <Button
    {...props}
    as={RouterLink}
  />

const LCTNS = gql`
  {
    lctns {
      guid
      computedLoc {
        coordinates
      }
      radars {
        deviationRange
      }
      seen
      profile {
        displayName
        profileImageMediaHash
        age
        profileId
        aboutMe
      }
    }
  }
`;

const MapPage = () => {

  const lctns = useQuery(LCTNS);

  console.log(lctns.data);
  let points = [];

  if (lctns.data) {
    points = lctns.data.lctns;
  }

  const [zoom, setZoom] = useState(13);
  const [position, setPosition] = useState([49.199154, 16.594434] as any);

  // .filter((x:any) => x.profile.age && x.profile.age < 27)

  return (
    <Box px={[20, 50, 100]}>

        <Map style={{ height: 600 }} center={position} zoom={zoom}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {points.map((p: any, i: number) =>
            <Marker
              key={i}
              position={R.reverse(p.computedLoc.coordinates) as any}
              opacity={p.radars[0].deviationRange[0] ? 0.5 : 1}
            >
              <Popup open>
                {p.profile && <div>
                  <div>{p.profile.profileId}</div>
                  {p.profile.profileImageMediaHash &&
                    <img height={100} src={`https://cdns.grindr.com/images/profile/1024x1024/${p.profile.profileImageMediaHash}`}></img>
                  }
                  <div>{p.profile.displayName}, {p.profile.age}</div>    
                  <div>{p.profile.aboutMe}</div>
                  <LinkButton to={`/profile/${p.guid}`}>Profile</LinkButton>
                </div>           
                }
                <div>{moment(Number(p.seen)).fromNow()}</div>
              </Popup>
            </Marker>
          )}

        </Map>


    </Box>
  );
}

export default MapPage;

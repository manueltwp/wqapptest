import React from "react"
import { graphql, navigate } from "gatsby"
import Layout from "../components/layout"
import creekImage from "../images/20180816_111841.jpg"
import {
  Grid,
  GridColumn,
  Image,
  Container,
  Divider,
  Table,
  TableRow,
  TableCell,
  TableBody,
  Icon,
  Dropdown,
  GridRow,
} from "semantic-ui-react"
import Mapbox from "../components/creekMap"
import creekStyles from "../styles/creek.module.css"

export default ({ data }) => {
  const creekData = data.allCreekSiteJson.edges[0].node
  const ptsNotFlat = data.allCreekSiteJson.edges.map(edge => edge.node.sites)
  const pts = [].concat(...ptsNotFlat)

  const colorLookUp = {
    Good: "green",
    Marginal: "yellow",
    Bad: "red",
    NA: "grey",
  }
  const analyteScores = data.allCreekScoresCsv.edges.map(edge => [
    edge.node.AnalyteName,
    edge.node.score,
  ])

  const siteOptions = creekData.sites.map(site => ({
    key: site.site_id,
    text: `${site.name} (${site.site_id})`,
    value: site.site_id,
  }))

  return (
    <Layout>
      <Container>
        <Grid>
          <GridColumn width={16}>
            <h1 className={creekStyles.creekHeader}>{creekData.creek_name}</h1>
          </GridColumn>
          <GridColumn width={6}>
            <Image src={creekImage} size="large"></Image>
            <Divider hidden />
            <p className={creekStyles.creekDescription}>
              {creekData.creek_description}
            </p>
          </GridColumn>
          <GridColumn width={10}>
            <Grid>
              <GridRow>
                <GridColumn width={16}>
                  <Mapbox
                    pts={pts}
                    height={300}
                    zoom={11}
                    lat={creekData.creek_lat}
                    long={creekData.creek_long}
                  />
                </GridColumn>
              </GridRow>
              <GridRow>
                <GridColumn width={8}>
                  <h3 className={creekStyles.header2}>Creek Report Card</h3>
                  <Table basic="very" celled collapsing>
                    <TableBody className={creekStyles.creekScore}>
                      {analyteScores.map(analyte => (
                        <TableRow>
                          <TableCell>{analyte[0]}</TableCell>
                          <TableCell>
                            <Icon
                              name="circle"
                              color={colorLookUp[analyte[1]]}
                            ></Icon>
                            {`  ${analyte[1]}`}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </GridColumn>
                <GridColumn width={8}>
                  <h3 className={creekStyles.header2}>
                    Explore Sampling Sites
                  </h3>
                  <Dropdown
                    placeholder="Select Site"
                    fluid
                    selection
                    options={siteOptions}
                    onChange={(e, data) => navigate(`site/${data.value}`)}
                  />
                </GridColumn>
              </GridRow>
            </Grid>
          </GridColumn>
        </Grid>
      </Container>
    </Layout>
  )
}

export const query = graphql`
  query($creekID: String!) {
    allCreekSiteJson(filter: { creek_id: { eq: $creekID } }) {
      edges {
        node {
          creek_name
          creek_description
          creek_id
          creek_lat
          creek_long
          sites {
            site_id
            name
            description
            lat
            long
          }
        }
      }
    }
    allCreekScoresCsv(filter: { creek_id: { eq: $creekID } }) {
      edges {
        node {
          creek_id
          AnalyteName
          score
        }
      }
    }
  }
`

import React, { useRef, useEffect, useState } from 'react';
import * as go from 'gojs';
import axiosInstance from '../services/axiosSetup';

const STROKE_WIDTH = 3;
const CORNER_ROUNDNESS = 12;
const theme = {
  colors: {
    femaleBadgeBackground: '#FFCBEA',
    maleBadgeBackground: '#A2DAFF',
    femaleBadgeText: '#7A005E',
    maleBadgeText: '#001C76',
    personText: 'black'
  },
  fonts: {
    badgeFont: 'bold 12px Poppins',
    birthDeathFont: '14px Poppins',
    nameFont: '500 18px Poppins',
  }
};

class GenogramLayout extends go.LayeredDigraphLayout {
    constructor() {
      super();
      this.initializeOption = go.LayeredDigraphInit.DepthFirstIn;
      this.spouseSpacing = 30;
      this.isRouting = false;
    }

    makeNetwork(coll) {
      const net = this.createNetwork();
      if (coll instanceof go.Diagram) {
        this.add(net, coll.nodes, true);
        this.add(net, coll.links, true);
      } else if (coll instanceof go.Group) {
        this.add(net, coll.memberParts, false);
      } else if (coll.iterator) {
        this.add(net, coll.iterator, false);
      }
      return net;
    }

    add(net, coll, nonmemberonly) {
      const horiz = this.direction === 0.0 || this.direction === 180.0;
      const multiSpousePeople = new go.Set();
      const it = coll.iterator;
      while (it.next()) {
        const node = it.value;
        if (!(node instanceof go.Node) || !node.data) continue;
        if (!node.isLayoutPositioned || !node.isVisible()) continue;
        if (nonmemberonly && node.containingGroup !== null) continue;
        if (node.isLinkLabel) {
          const link = node.labeledLink;
          if (link.category === "Marriage") {
            const spouseA = link.fromNode;
            const spouseB = link.toNode;
            const vertex = net.addNode(node);
            if (horiz) {
              vertex.height = spouseA.actualBounds.height + this.spouseSpacing + spouseB.actualBounds.height;
              vertex.width = Math.max(spouseA.actualBounds.width, spouseB.actualBounds.width);
              vertex.focus = new go.Point(vertex.width / 2, spouseA.actualBounds.height + this.spouseSpacing / 2);
            } else {
              vertex.width = spouseA.actualBounds.width + this.spouseSpacing + spouseB.actualBounds.width;
              vertex.height = Math.max(spouseA.actualBounds.height, spouseB.actualBounds.height);
              vertex.focus = new go.Point(spouseA.actualBounds.width + this.spouseSpacing / 2, vertex.height / 2);
            }
          }
        } else {
          let marriages = 0;
          node.linksConnected.each(l => {
            if (l.category === "Marriage") marriages++;
          });
          if (marriages === 0) {
            net.addNode(node);
          } else if (marriages > 1) {
            multiSpousePeople.add(node);
          }
        }
      }
      it.reset();
      while (it.next()) {
        const link = it.value;
        if (!(link instanceof go.Link)) continue;
        if (!link.isLayoutPositioned || !link.isVisible()) continue;
        if (nonmemberonly && link.containingGroup !== null) continue;
        if (link.category !== "Marriage" && link.data) {
          const parent = net.findVertex(link.fromNode);
          const child = net.findVertex(link.toNode);
          if (child !== null) {
            net.linkVertexes(parent, child, link);
          } else {
            link.toNode.linksConnected.each(l => {
              if (l.category !== "Marriage" || !l.data) return;
              const mlab = l.labelNodes.first();
              const mlabvert = net.findVertex(mlab);
              if (mlabvert !== null) {
                net.linkVertexes(parent, mlabvert, link);
              }
            });
          }
        }
      }
      while (multiSpousePeople.count > 0) {
        const node = multiSpousePeople.first();
        const cohort = new go.Set();
        this.extendCohort(cohort, node);
        const dummyvert = net.createVertex();
        net.addVertex(dummyvert);
        const marriages = new go.Set();
        cohort.each(n => {
          n.linksConnected.each(l => {
            marriages.add(l);
          })
        });
        marriages.each(link => {
          const mlab = link.labelNodes.first()
          const v = net.findVertex(mlab);
          if (v !== null) {
            net.linkVertexes(dummyvert, v, null);
          }
        });
        multiSpousePeople.removeAll(cohort);
      }
    }

    extendCohort(coll, node) {
      if (coll.has(node)) return;
      coll.add(node);
      node.linksConnected.each(l => {
        if (l.category === "Marriage") {
          this.extendCohort(coll, l.fromNode);
          this.extendCohort(coll, l.toNode);
        }
      });
    }

    assignLayers() {
      super.assignLayers();
      const horiz = this.direction === 0.0 || this.direction === 180.0;
      const maxsizes = [];
      this.network.vertexes.each(v => {
        const lay = v.layer;
        let max = maxsizes[lay];
        if (max === undefined) max = 0;
        const sz = (horiz ? v.width : v.height);
        if (sz > max) maxsizes[lay] = sz;
      });
      this.network.vertexes.each(v => {
        const lay = v.layer;
        const max = maxsizes[lay];
        if (horiz) {
          v.focus = new go.Point(0, v.height / 2);
          v.width = max;
        } else {
          v.focus = new go.Point(v.width / 2, 0);
          v.height = max;
        }
      });
    }

    initializeIndices() {
      super.initializeIndices();
      const vertical = this.direction === 90 || this.direction === 270;
      this.network.edges.each(e => {
        if (e.fromVertex.node && e.fromVertex.node.isLinkLabel) {
          e.portFromPos = vertical ? e.fromVertex.focusX : e.fromVertex.focusY;
        }
        if (e.toVertex.node && e.toVertex.node.isLinkLabel) {
          e.portToPos = vertical ? e.toVertex.focusX : e.toVertex.focusY;
        }
      })
    }

    commitNodes() {
      super.commitNodes();
      this.network.vertexes.each(v => {
        if (v.node !== null && !v.node.isLinkLabel) {
          v.node.position = new go.Point(v.x, v.y);
        }
      });

      const horiz = this.direction === 0.0 || this.direction === 180.0;
      this.network.vertexes.each(v => {
        if (v.node === null) return;
        if (!v.node.isLinkLabel) return;
        const labnode = v.node;
        const lablink = labnode.labeledLink;
        lablink.invalidateRoute();
        let spouseA = lablink.fromNode;
        let spouseB = lablink.toNode;
        if (spouseA.opacity > 0 && spouseB.opacity > 0) {
          if (spouseA.category !== "Masculin") {
            const temp = spouseA;
            spouseA = spouseB;
            spouseB = temp;
          }
          const aParentsNode = this.findParentsMarriageLabelNode(spouseA);
          const bParentsNode = this.findParentsMarriageLabelNode(spouseB);
          if (aParentsNode !== null && bParentsNode !== null &&
            (horiz
              ? aParentsNode.position.x > bParentsNode.position.x
              : aParentsNode.position.y > bParentsNode.position.y)) {
            const temp = spouseA;
            spouseA = spouseB;
            spouseB = temp;
          }
          spouseA.moveTo(v.x, v.y);
          if (horiz) {
            spouseB.moveTo(v.x, v.y + spouseA.actualBounds.height + this.spouseSpacing);
          } else {
            spouseB.moveTo(v.x + spouseA.actualBounds.width + this.spouseSpacing, v.y);
          }
        } else if (spouseA.opacity === 0) {
          const pos = horiz
            ? new go.Point(v.x, v.centerY - spouseB.actualBounds.height / 2)
            : new go.Point(v.centerX - spouseB.actualBounds.width / 2, v.y);
          spouseB.move(pos);
          if (horiz) pos.y++; else pos.x++;
          spouseA.move(pos);
        } else if (spouseB.opacity === 0) {
          const pos = horiz
            ? new go.Point(v.x, v.centerY - spouseA.actualBounds.height / 2)
            : new go.Point(v.centerX - spouseA.actualBounds.width / 2, v.y);
          spouseA.move(pos);
          if (horiz) pos.y++; else pos.x++;
          spouseB.move(pos);
        }
        lablink.ensureBounds();
      });
    }

    findParentsMarriageLabelNode(node) {
      const it = node.findNodesInto();
      while (it.next()) {
        const n = it.value;
        if (n.isLinkLabel) return n;
      }
      return null;
    }
}

const GoJSDiagram = () => {
  const diagramRef = useRef(null);
  const [familyNode, setFamilyNode] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
        try {
            const response = await axiosInstance.get('/tree/generation');

            setFamilyNode(response.data.map(member => {
              const baseMember = {
                key: member._id,
                pere_id: member?.pere?._id,
                mere_id: member?.mere?._id,
                lien: (member?.lien?.type_de_lien === undefined) ? 'Family Owner' : member?.lien?.type_de_lien,
                date_de_naissance: member.date_de_naissance,
                name: member.nom,
                prenom: member.prenom,
                sexe: member.sexe,
              };
              if (member?.id_conjoint) {
                baseMember.ux = member.id_conjoint;
              }
              return baseMember;
            }));
            
        } catch (error) {
            console.error('Erreur lors de la récupération des membres', error);
        }
    };
    fetchMembers();
}, []);

  useEffect(() => {
    const $ = go.GraphObject.make;
    
    const diagram = $(go.Diagram, diagramRef.current, {
      "animationManager.isEnabled": false,
      "initialAutoScale": go.AutoScale.Uniform,
      "undoManager.isEnabled": true,
      "maxSelectionCount": 1,
      "nodeSelectionAdornmentTemplate":
      $(go.Adornment, "Auto",
        { layerName: "Grid" },
        $(go.Shape, "RoundedRectangle", { fill: "#c1cee3", stroke: null}),
        $(go.Placeholder, { margin: 0 })
      ),
    "layout":
      $(GenogramLayout, { direction: 90, layerSpacing: 30, columnSpacing: 10})
      }
    );
    
    diagram.nodeTemplate = 
    $(go.Node, 'Spot',
      {locationSpot: go.Spot.Center},
      $(go.Shape,
        {
          figure: 'RoundedRectangle',
          desiredSize: new go.Size(205, 125),
          parameter1: CORNER_ROUNDNESS,
          strokeWidth: 3,
        },
        new go.Binding('fill', 'sexe', sexe => sexe === 'Masculin' ? theme.colors.maleBadgeBackground : theme.colors.femaleBadgeBackground)
      ),
      $(go.TextBlock,
        {
          stroke: theme.colors.personText,
          font: theme.fonts.nameFont,
          alignmentFocus: go.Spot.Top,
          alignment: new go.Spot(0.5, 1, 0, -95)
        },
        new go.Binding('text', 'prenom'),
      ),
      $(go.TextBlock,
        {
          stroke: theme.colors.personText,
          font: theme.fonts.nameFont,
          desiredSize: new go.Size(160, 50),
          overflow: go.TextOverflow.Ellipsis,
          textAlign: 'center',
          verticalAlignment: go.Spot.Center,
        },
        new go.Binding('text', 'name'),
      ),
      $(go.TextBlock,
        {
          stroke: theme.colors.personText,
          font: theme.fonts.birthDeathFont,
          alignmentFocus: go.Spot.Top,
          alignment: new go.Spot(0.5, 1, 0, -35)
        },
        new go.Binding('text', 'date_de_naissance', date => `${new Date(date).toLocaleDateString()}`)
      ),
      $(go.Panel, 'Auto',
        {
          alignmentFocus: go.Spot.TopRight,
          alignment: new go.Spot(1, 0, -15, STROKE_WIDTH - 0.5)
        },
        $(go.Shape, 
          {
            figure: 'RoundedRectangle',
            parameter1: CORNER_ROUNDNESS,
            parameter2: 4 | 8,
            desiredSize: new go.Size(NaN, 22.5),
            fill: 'white',
          },
        ),
        $(go.TextBlock, 
          {
            font: theme.fonts.badgeFont
          },
          new go.Binding('text', 'lien'),
        )
      ),
    );

    diagram.linkTemplate = 
    $(go.Link,
      {
        routing: go.Routing.AvoidsNodes, corner: 10, curviness: 15,
        fromSpot: go.Spot.TopBottomSides, toSpot: go.Spot.TopBottomSides,
        layerName: "Background", selectable: false
      },
      $(go.Shape, { stroke: 'black', strokeWidth: 2 })
  );

    diagram.linkTemplateMap.add("Marriage",
      $(go.Link,
        {
          routing: go.Routing.Orthogonal, corner: 1,
          fromSpot: go.Spot.LeftRightSides, toSpot: go.Spot.LeftRightSides,
          selectable: false, isTreeLink: true, layerName: "Background"
        },
        $(go.Shape, { strokeWidth: 3})
      )
    );

    setupDiagram(diagram, familyNode, 4);

    function setupDiagram(diagram, array, focusId) {
        diagram.model =
          new go.GraphLinksModel({
              linkLabelKeysProperty: "labelKeys",
              copiesArrays: true,
              nodeDataArray: array
            });
        setupMarriages(diagram);
        setupParents(diagram);
    
        const node = diagram.findNodeForKey(focusId);
        if (node !== null) node.isSelected = true;
      }
    
    function findMarriage(diagram, a, b) {
        const nodeA = diagram.findNodeForKey(a);
        const nodeB = diagram.findNodeForKey(b);
        if (nodeA !== null && nodeB !== null) {
          const it = nodeA.findLinksBetween(nodeB); 
          while (it.next()) {
            const link = it.value;
            if (link.data !== null && link.data.category === "Marriage") return link;
          }
        }
        return null;
    }
    
    function setupMarriages(diagram) {
        const model = diagram.model;
        const nodeDataArray = model.nodeDataArray;
        for (let i = 0; i < nodeDataArray.length; i++) {
          const data = nodeDataArray[i];
          const key = data.key;
          let uxs = data?.ux ;
          if (uxs !== undefined) {
            if (typeof uxs === "string") uxs = [uxs];
            for (let j = 0; j < uxs?.length; j++) {
              const wife = uxs[j];
              const link = findMarriage(diagram, key, wife);
              if (link === null) {
                const mlab = { category: "LinkLabel" };
                model.addNodeData(mlab);
                const mdata = { from: key, to: wife, labelKeys: [mlab.key], category: "Marriage" };
                model.addLinkData(mdata);
              }
            }
          }
        }
    }
    
    function setupParents(diagram) {
      const model = diagram.model;
      const nodeDataArray = model.nodeDataArray;
      for (let i = 0; i < nodeDataArray.length; i++) {
        const data = nodeDataArray[i];
        const key = data.key;
        const mother = data.mere_id;
        const father = data.pere_id;
        if (mother !== undefined && father !== undefined) {
          const link = findMarriage(diagram, mother, father);
          console.log("unknown marriage: " + mother + " & " + father);
          if (link === null) {
            const ldata1 = { from: father, to: key};
            diagram.model.addLinkData(ldata1);
            const ldata2 = { from: mother, to: key};
            diagram.model.addLinkData(ldata2);
            continue;
          }
          const mdata = link.data;
          if (mdata.labelKeys === undefined || mdata.labelKeys[0] === undefined) continue;
          const mlabkey = mdata.labelKeys[0];
          const cdata = { from: mlabkey, to: key };
          diagram.model.addLinkData(cdata);
        } else {
          if (father !== undefined) {
            const ldata = { from: father, to: key};
            diagram.model.addLinkData(ldata);
          }
          if (mother !== undefined) {
            const ldata = { from: mother, to: key};
            diagram.model.addLinkData(ldata);
          }
        }
      }
    }

    return () => diagram.div = null;
  }, [familyNode]);

  return <div ref={diagramRef} style={{ width: '1800px', height: '1200px', border: '1px solid black' }}></div>;
};

export default GoJSDiagram; 
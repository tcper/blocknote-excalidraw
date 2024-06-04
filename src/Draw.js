import { createReactBlockSpec } from "@blocknote/react";
import { Excalidraw, exportToSvg } from "@excalidraw/excalidraw";
import throttle from "lodash.throttle";

window.EXCALIDRAW_ASSET_PATH = "/";

let excalidrawAPI = null

const toExternalHTML = (block) => {
    if (!excalidrawAPI) {
        return
    }
    let parser = new DOMParser();
    let doc = parser.parseFromString(block.props.svg, "image/svg+xml");
    return {
        dom: doc
    }
}

let update = throttle((props, elements, appState, files) => {
    exportToSvg({
        elements, appState, files
    }).then(svg => {
        let editor = props.editor
        editor.updateBlock(props.block, {
            props: {
                svg: svg.outerHTML
            },
        })
    })
}, 1000)

export const Draw = createReactBlockSpec(
  {
    type: "draw",
    propSchema: {
        width: {
            default: '100%'
        },
        height: {
            default: '500px'
        },
        svg: {
            default: ''
        }
    },
    content: "none",
  },
  {
    render: (props) => {
      return (
        <div style={{ height: props.block.props.height, width: props.block.props.width }} ref={props.contentRef}>
            <Excalidraw 
                excalidrawAPI={(api) => excalidrawAPI = api} 
                onChange={( elements,
                    appState,
                    files) => {
                        update(props, elements, appState, files)
                }}
            />
        </div>
      );
    },
    toExternalHTML
  }
);
 
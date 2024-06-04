import "@blocknote/core/fonts/inter.css";
import {
  BlockNoteSchema,
  defaultBlockSpecs,
  filterSuggestionItems,
  insertOrUpdateBlock,
} from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import {
  SuggestionMenuController,
  getDefaultReactSlashMenuItems,
  useCreateBlockNote,
} from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
 
import { RiAlertFill } from "react-icons/ri";
import { Alert } from "./Alert";
import { Draw } from './Draw'

import './App.css';

function App() {
  const schema = BlockNoteSchema.create({
    blockSpecs: {
      // Adds all default blocks.
      ...defaultBlockSpecs,
      // Adds the Alert block.
      alert: Alert,
      draw: Draw
    },
  });
   
  // Slash menu item to insert an Alert block
  const insertAlert = (editor) => ({
    title: "Alert",
    onItemClick: () => {
      insertOrUpdateBlock(editor, {
        type: "alert",
      });
    },
    aliases: [
      "alert",
      "notification",
      "emphasize",
      "warning",
      "error",
      "info",
      "success",
    ],
    group: "Other",
    icon: <RiAlertFill />,
  });

  const insertDraw = (editor) => ({
    title: "Draw",
    onItemClick: () => {
      insertOrUpdateBlock(editor, {
        type: "draw",
      });
    },
    aliases: [
      "draw",
    ],
    group: "Other",
    icon: <RiAlertFill />,
  })
  
  const editor = useCreateBlockNote({
    schema,
    initialContent: [
      {
        type: "paragraph",
        content: "Welcome to this demo!",
      },
      {
        type: "alert",
        content: "This is an example alert",
      },
      {
        type: "paragraph",
        content: "Press the '/' key to open the Slash Menu and add another",
      },
      {
        type: "paragraph",
      },
    ],
  });

  return (
    <div className="App">
      <button onClick={() => {
        console.log(editor.document)
      }}>Save</button>
       <BlockNoteView editor={editor} slashMenu={false}
        onChange={() => {
          // Saves the document JSON to state.
          
        }}
       >
      {/* Replaces the default Slash Menu. */}
      <SuggestionMenuController
        triggerCharacter={"/"}
        getItems={async (query) =>
          // Gets all default slash menu items and `insertAlert` item.
          filterSuggestionItems(
            [...getDefaultReactSlashMenuItems(editor), insertAlert(editor), insertDraw(editor)],
            query
          )
        }
      />
    </BlockNoteView>
    </div>
  );
}

export default App;

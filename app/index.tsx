"use client";

import Image from "next/image";
import { Dialog, Switch, Transition } from "@headlessui/react";
import { ReactNode, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import sampleMd from "./data.json";
import { marked } from "marked";
import * as DOMPurify from "isomorphic-dompurify";
import IconDelete from "@/components/icons/icon-delete";
import IconHidePreview from "@/components/icons/icon-hide-preview";
import IconShowPreview from "@/components/icons/icon-show-preview";
import { DateTime } from "luxon";

function Menu({
  showMenu,
  documents,
  createDocument,
  loadDocument,
}: {
  showMenu: boolean;
  documents: Document[];
  createDocument: () => void;
  loadDocument: (val: number) => void;
}) {
  const { resolvedTheme, setTheme } = useTheme();
  const darkMode = resolvedTheme === "dark";
  const setDarkMode = (val: boolean) => setTheme(val ? "light" : "dark");

  return (
    <Transition
      as={"nav"}
      show={showMenu}
      enter={"transition-transform duration-75"}
      enterFrom={"-translate-x-[250px]"}
      enterTo={"translate-x-0"}
      leave={"transition-transform duration-75"}
      leaveFrom={"translate-x-0"}
      leaveTo={"-translate-x-[250px]"}
      className={
        "h-screen w-[250px] bg-grey-900 flex-shrink-0 p-6 flex flex-col"
      }
      aria-labelledby={"my-docs-heading"}
    >
      <Image
        alt={"markdown logo"}
        src={"./logo.svg"}
        width={"130"}
        height={"12"}
        className={"mt-2 flex-none"}
      />
      <h2
        className={
          "font-medium text-grey-500 uppercase mt-6 text-sm tracking-[2px] flex-none"
        }
        id={"my-docs-heading"}
      >
        My Documents
      </h2>
      <button
        type={"button"}
        className={
          "w-full bg-orange-700 hover:bg-orange-400 rounded p-2 text-grey-100 font-normal text-[15px] mt-6 flex-none"
        }
        onClick={createDocument}
      >
        + New Document
      </button>
      <div className={"flex-grow flex flex-col justify-start items-start mt-4"}>
        {documents &&
          documents.map((doc, idx) => (
            <DocumentItem
              key={`${doc.name}${doc.createdAt}`}
              className={"my-2"}
            >
              <span className={`text-grey-500 font-light text-xs sm:text-xs`}>
                {doc.createdAt}
                <br />
              </span>
              <span
                className={
                  "text-grey-100 hover:text-orange-700 font-normal text-sm"
                }
              >
                <a tabIndex={0} onClick={() => loadDocument(idx)}>
                  {doc.name}
                </a>
              </span>
            </DocumentItem>
          ))}
      </div>
      <div className={"flex-none flex items-center justify-center"}>
        <Image
          alt={"dark mode icon"}
          src={"./icon-dark-mode.svg"}
          height={22}
          width={22}
          className={`${darkMode && "brightness-200"}`}
        />
        <Switch
          checked={!darkMode}
          onChange={setDarkMode}
          className={
            "bg-grey-700 relative inline-flex h-[24px] w-[48px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-orange-400 mx-4"
          }
        >
          <span className="sr-only">Toggle dark mode</span>
          <span
            aria-hidden="true"
            className={`${darkMode ? "translate-x-1" : "translate-x-[26px]"}
            mt-[3px] pointer-events-none inline-block h-[14px] w-[14px] transform rounded-full bg-grey-100 ring-0 transition duration-200 ease-in-out`}
          />
        </Switch>
        <Image
          alt={"light mode icon"}
          src={"./icon-light-mode.svg"}
          height={22}
          width={22}
          className={`${!darkMode && "brightness-200"}`}
        />
        <div className={"flex-grow"}></div>
      </div>
    </Transition>
  );
}

function DocumentItem({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`${className} flex items-center justify-start`}>
      <Image
        src={"./icon-document.svg"}
        alt={"document icon"}
        width={14}
        height={16}
        className={"mr-4"}
      />
      <div className={"leading-3 max-w-[400px] w-full"}>{children}</div>
    </div>
  );
}

function EditorMode({
  showMarkdown,
  setShowMarkdown,
  editorType,
}: {
  showMarkdown: boolean;
  setShowMarkdown: (arg0: boolean) => void;
  editorType: "markdown" | "preview";
}) {
  return (
    <div
      className={
        "h-[42px] w-full bg-grey-200 dark:bg-grey-900 flex items-center justify-center flex-none"
      }
    >
      <h2
        className={
          "text-sm text-grey-500 dark:text-grey-400 uppercase font-bold tracking-[2px] mx-4"
        }
        id={`${editorType}-heading`}
      >
        {editorType === "preview" ? "Preview" : "Markdown"}
      </h2>
      <div className={"flex-grow flex-shrink"} />
      <button
        className={`group h-full ${editorType === "markdown" && "sm:hidden"}`}
        aria-label={`${showMarkdown ? "hide" : "show"} markdown editor`}
        onClick={() => setShowMarkdown(!showMarkdown)}
      >
        {showMarkdown ? (
          <IconShowPreview
            aria-hidden
            alt={`show preview icon`}
            className={"mx-4 fill-grey-500 group-hover:fill-orange-700"}
          />
        ) : (
          <IconHidePreview
            aria-hidden
            alt={`hide preview icon`}
            className={"mx-4 fill-grey-500 group-hover:fill-orange-700"}
          />
        )}
      </button>
    </div>
  );
}

interface Document {
  createdAt: string;
  name: string;
  content: string;
}

export default function Index() {
  const [showMenu, setShowMenu] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showMarkdown, setShowMarkdown] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [docIndex, setDocIndex] = useState(0);
  const [content, setContent] = useState("");

  const doc = documents[docIndex];

  useEffect(() => {
    const lsDocs = localStorage.getItem("documents");
    const docs = lsDocs !== null ? JSON.parse(lsDocs) : sampleMd;
    setDocuments(docs);
    setContent(docs[0].content);
  }, []);

  useEffect(() => {
    if (documents && documents.length) {
      localStorage.setItem("documents", JSON.stringify(documents));
    }
  }, [documents]);

  const createDocument = () => {
    setDocuments([
      ...documents,
      {
        createdAt: DateTime.utc().toISODate()!.toString(),
        name: "new-document.md",
        content: "",
      },
    ]);
    setDocIndex(documents.length);
    setContent("");
  };

  const loadDocument = (idx: number) => {
    setDocIndex(idx);
    setContent(documents[idx].content);
  };

  const deleteDocument = () => {
    let newDocs = documents.toSpliced(docIndex, 1);
    if (newDocs.length === 0) {
      newDocs.push({
        createdAt: DateTime.utc().toISODate()!.toString(),
        name: "new-document.md",
        content: "",
      });
    }
    setDocuments(newDocs);
    setDocIndex(0);
    setContent(newDocs[0].content);
    setShowDelete(false);
  };

  const saveChanges = () => {
    const newDocs = [...documents];
    newDocs[docIndex].content = content;
    setDocuments(newDocs);
  };

  const setDocName = (val: string) => {
    const newDocs = [...documents];
    newDocs[docIndex].name = val;
    setDocuments(newDocs);
  };

  return (
    <div className={"fixed inset-0 overflow-hidden flex"}>
      <Dialog
        open={showDelete}
        onClose={() => setShowDelete(false)}
        className={"relative z-50"}
      >
        {/* Scrim */}
        <div
          className="fixed inset-0 bg-grey-1000 dark:bg-grey-500 bg-opacity-50 dark:bg-opacity-50"
          aria-hidden="true"
        />
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <Dialog.Panel
            className={"max-w-[343px] bg-grey-100 dark:bg-grey-900 p-6 rounded"}
          >
            <Dialog.Title
              className={
                "font-bold text-[20px] text-grey-700 dark:text-grey-100 font-serif"
              }
            >
              Delete this document?
            </Dialog.Title>
            <Dialog.Description className={"sr-only"}>
              This will permanently delete the document.
            </Dialog.Description>

            <p
              className={
                "text-grey-500 dark:text-grey-400 text-[14px] font-serif font-normal leading-[24px] mt-2"
              }
            >
              Are you sure you want to delete the &quot;{doc?.name}&quot;
              document and its contents? This action cannot be reversed.
            </p>

            <button
              className={
                "w-full bg-orange-700 hover:bg-orange-400 rounded p-2 text-grey-100 font-normal text-[15px] mt-4"
              }
              onClick={() => deleteDocument()}
            >
              Confirm & Delete
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>

      <Menu
        showMenu={showMenu}
        documents={documents}
        createDocument={createDocument}
        loadDocument={loadDocument}
      />

      <div className={"w-full flex-shrink-0 flex flex-col"}>
        <header
          className={
            "h-[56px] sm:h-[72px] bg-grey-800 flex items-center justify-center flex-none"
          }
          aria-labelledby={"toolbar-h2"}
        >
          <h2 id={"toolbar-h2"} className={"sr-only"}>
            Toolbar
          </h2>
          <button
            className={
              "group h-full bg-grey-700 hover:bg-orange-700 w-[56px] sm:w-[72px] flex-grow-0 flex items-center"
            }
            aria-label={`${showMenu ? "hide" : "show"} menu`}
            onClick={() => setShowMenu(!showMenu)}
          >
            {showMenu ? (
              <Image
                alt={"close icon"}
                src={"./icon-close.svg"}
                width={20}
                height={20}
                className={`mx-auto sm:w-[24px] sm:h-[24px] bg-grey-700 group-hover:bg-orange-700 my-auto`}
              />
            ) : (
              <Image
                alt={"menu icon"}
                src={"./icon-menu.svg"}
                width={23}
                height={12}
                className={`mx-auto sm:w-[30px] sm:h-[18px] bg-grey-700 group-hover:bg-orange-700 my-auto`}
              />
            )}
          </button>
          <Image
            alt={"markdown logo"}
            src={"./logo.svg"}
            width={"130"}
            height={"12"}
            className={"hidden lg:block mx-6"}
          />
          <div
            className={"hidden lg:block border-l border-grey-600 h-[40px]"}
          ></div>
          <DocumentItem className={"ml-4 sm:ml-6 flex-grow"}>
            <span
              className={`hidden sm:inline text-grey-500 font-light text-xs sm:text-xs`}
              id={"document-name"}
            >
              Document Name
              <br />
            </span>

            <input
              type={"text"}
              className={
                "w-full bg-grey-800 font-normal text-[15px] text-grey-100 mt-1 pb-1 border-b border-transparent focus:border-grey-100 caret-orange-700 outline-0"
              }
              value={doc?.name ?? ""}
              onChange={(val) => setDocName(val.target.value)}
              aria-labelledby={"document-name"}
            />
          </DocumentItem>
          <button
            className={"h-[40px] w-[40px] ml-2 group"}
            aria-label={"Delete document"}
            onClick={() => setShowDelete(true)}
          >
            <IconDelete
              alt={"delete icon"}
              className={"fill-grey-500 group-hover:fill-orange-700 mx-auto"}
              aria-hidden
            />
          </button>
          <button
            className={
              "bg-orange-700 hover:bg-orange-400 text-grey-200 text-sm rounded h-[40px] w-[40px] sm:w-fit sm:px-4 mx-2 sm:mx-4"
            }
            aria-labelledby={"save-changes"}
            onClick={() => saveChanges()}
          >
            <Image
              src={"./icon-save.svg"}
              alt={"save icon"}
              width={16}
              height={16}
              className={"sm:mr-2 inline"}
              aria-hidden
            />
            <span
              className={"hidden sm:inline sm:text-[15px]"}
              id={"save-changes"}
            >
              Save Changes
            </span>
          </button>
        </header>
        <main className={`h-0 grow flex`}>
          {showMarkdown && (
            <>
              <section
                className={"h-full w-full sm:w-1/2 flex flex-col"}
                aria-labelledby={"markdown-heading"}
              >
                <EditorMode
                  showMarkdown={showMarkdown}
                  setShowMarkdown={setShowMarkdown}
                  editorType={"markdown"}
                ></EditorMode>
                <textarea
                  className={
                    "w-full h-0 grow p-4 font-mono resize-none text-grey-700 dark:bg-grey-1000 dark:text-grey-400 caret-orange-700 outline-0"
                  }
                  placeholder={"Enter Markdown text."}
                  value={content}
                  onChange={(val) => setContent(val.target.value)}
                ></textarea>
              </section>
              <div
                className={
                  "w-[1px] flex-none h-full bg-grey-300 dark:bg-grey-600"
                }
              />
            </>
          )}

          <section
            className={`h-full ${
              showMarkdown ? "hidden sm:flex sm:w-1/2" : "w-full flex"
            } flex-col`}
            aria-labelledby={"preview-heading"}
          >
            <EditorMode
              showMarkdown={showMarkdown}
              setShowMarkdown={setShowMarkdown}
              editorType={"preview"}
            ></EditorMode>
            <div
              className={
                "max-w-[672px]  w-full mx-auto p-4 overflow-y-auto " +
                "prose dark:prose-invert " +
                "prose-h1:font-serif prose-h1:font-bold prose-h1:text-[32px] prose-h1:text-grey-700 dark:prose-h1:text-grey-100 " +
                "prose-h2:font-serif prose-h2:font-light prose-h2:text-[28px] prose-h2:text-grey-700 dark:prose-h2:text-grey-100 " +
                "prose-h3:font-serif prose-h3:font-bold prose-h3:text-[24px] prose-h3:text-grey-700 dark:prose-h3:text-grey-100 " +
                "prose-h4:font-serif prose-h4:font-bold prose-h4:text-[20px] prose-h4:text-grey-700 dark:prose-h4:text-grey-100 " +
                "prose-h5:font-serif prose-h5:font-bold prose-h5:text-[16px] prose-h5:text-grey-700 dark:prose-h5:text-grey-100 " +
                "prose-h6:font-serif prose-h6:font-bold prose-h6:text-[14px] prose-h6:text-orange-700 " +
                "prose-p:font-serif prose-p:text-grey-500 dark:prose-p:text-grey-400 prose-p:text-[14px] " +
                "prose-li:font-serif prose-li:text-grey-500 dark:prose-li:text-grey-400 prose-li:text-[14px] marker:prose-ul:text-orange-700 " +
                "prose-blockquote:border-l-orange-700 prose-blockquote:rounded prose-blockquote:bg-grey-200 dark:prose-blockquote:bg-grey-800 prose-blockquote:p-4 " +
                "prose-blockquote:not-italic prose-blockquote:text-[14px] prose-blockquote:font-bold prose-blockquote:text-grey-700 dark:prose-blockquote:text-grey-100 " +
                "prose-code:font-normal prose-code:text-grey-700 dark:prose-code:text-grey-100 prose-code:break-all " +
                "prose-pre:bg-grey-200 dark:prose-pre:bg-grey-800 prose-pre:rounded prose-pre:p-4 " +
                "prose-a:font-bold prose-a:text-grey-700 dark:prose-a:text-grey-100 "
              }
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(marked.parse(content ?? "")),
              }}
            />
          </section>
        </main>
      </div>
    </div>
  );
}

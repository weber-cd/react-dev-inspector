import React, { Component, Ref } from 'react'
// import type { Fiber } from 'react-reconciler'
import hotkeys from 'hotkeys-js'
import { setupHighlighter } from './utils/hightlight'
import {
  getElementCodeInfo,
  gotoEditor,
  getElementInspect,
  CodeInfo,
} from './utils/inspect'
import Overlay from './Overlay'


export interface InspectParams {
  /** hover / click event target dom element */
  element: HTMLElement,
  /** nearest named react component fiber for dom element */
  // fiber?: Fiber,
  /** source file line / column / path info for react component */
  codeInfo?: CodeInfo,
  /** react component name for dom element */
  name?: string,
}

export interface InspectStates {
  isInspect: boolean,
}

export type ElementHandler = (params: InspectParams) => void

export const defaultHotKeys = ['control', 'shift', 'command', 'c']

export interface InspectorProps {
  /**
   * inspector toggle hotkeys
   *
   * supported keys see: https://github.com/jaywcjlove/hotkeys#supported-keys
   */
  keys?: string[],
  onHoverElement?: ElementHandler,
  onClickElement?: ElementHandler,
  /**
   * whether disable click react component to open IDE for view component code
   */
  disableLaunchEditor?: boolean,
}

export class Inspector extends Component<InspectorProps, InspectStates> {
  overlayRef = {
    current: new Overlay()
  };
  hotkey = defaultHotKeys.join('+')
  constructor(props){
    super(props)
    this.state = {
      isInspect: false
    }
    const { keys } = props
    this.hotkey = (keys ?? defaultHotKeys).join('+')
  }
  handleHoverElement = (element: HTMLElement) => {
    const { onHoverElement } = this.props
    const overlay = this.overlayRef?.current

    const codeInfo = getElementCodeInfo(element)
    const relativePath = codeInfo?.relativePath
    const { name, title } = getElementInspect(element, relativePath)
    overlay?.inspect?.([element], title, relativePath)

    onHoverElement?.({
      element,
      // fiber,
      codeInfo,
      name,
    })
  }
  handleClickElement = (element: HTMLElement) => {
    const { onClickElement, disableLaunchEditor } = this.props
    const overlay = this.overlayRef?.current
    overlay?.remove?.()
    // this.overlayRef.current = undefined
    this.setState({
      isInspect: false
    })

    const codeInfo = getElementCodeInfo(element)
    const relativePath = codeInfo?.relativePath

    const { name } = getElementInspect(element, relativePath)

    if (!disableLaunchEditor) gotoEditor(codeInfo)
    onClickElement?.({
      element,
      // fiber,
      codeInfo,
      name,
    })
  }
  startInspect = () => {
    const overlay = new Overlay()

    const stopCallback = setupHighlighter({
      onPointerOver: this.handleHoverElement,
      onClick: this.handleClickElement,
    })

    overlay.setRemoveCallback(stopCallback)

    this.overlayRef.current = overlay
    // setIsInspect(true)
    this.setState({
      isInspect: true
    })
  }

  stopInspect = () => {
    this.overlayRef.current?.remove()
    this.setState({
      isInspect: false
    })
  }

  handleInspectKey = () => (
    this.state.isInspect
      ? this.stopInspect()
      : this.startInspect()
  )

  componentDidMount(){
    const handleHotKeys = (event, handler) => {
      if (handler.key === this.hotkey) {
        this.handleInspectKey()
      }
    }

    hotkeys(this.hotkey, handleHotKeys)
    window.__REACT_DEV_INSPECTOR_TOGGLE__ = this.handleInspectKey
  }
  render(){
    const { children } = this.props
    return <div>{children}</div>
  }
}
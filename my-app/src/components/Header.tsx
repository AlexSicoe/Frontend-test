import React from 'react'

export default function Header() {
  return (
    <header>
      <div id="title">Title</div>
      <SettingsButton />
    </header>
  )
}

export function SettingsButton() {
  return (
    <span id="cog">
      <div className="fa fa-cog" />
    </span>
  )
}

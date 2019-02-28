import React from 'react'

export default function Header() {
  return (
    <header>
      Title <SettingsButton />
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

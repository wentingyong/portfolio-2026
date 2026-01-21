import { useEffect, useState } from 'react'

interface TimeInfo {
  timeString: string
  timezone: string
}

/**
 * Hook to sync current time with EST timezone
 * Updates every second
 */
export function useCurrentTime(): TimeInfo {
  const [timeInfo, setTimeInfo] = useState<TimeInfo>({
    timeString: '00:00:00',
    timezone: 'EST',
  })

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const estTime = new Date(
        now.toLocaleString('en-US', { timeZone: 'America/New_York' })
      )

      const hours = estTime.getHours().toString().padStart(2, '0')
      const minutes = estTime.getMinutes().toString().padStart(2, '0')
      const seconds = estTime.getSeconds().toString().padStart(2, '0')

      setTimeInfo({
        timeString: `${hours}:${minutes}:${seconds}`,
        timezone: 'EST',
      })
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  return timeInfo
}

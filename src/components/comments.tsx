import Giscus from '@giscus/react'
import { colorModeEffect, Mode } from '@/common/color-mode'
import { useEffect, useRef, useState } from 'react'

export default function Comments() {
  const colorMode = colorModeEffect()

  function format(value: Mode) {
    return value === Mode.System ? Mode.Light : value
  }

  const [mode, setMode] = useState((format(colorMode.getCurrentMode())))

  function commentColorModeChange(value: Mode) {
    setMode(format(value))
  }


  const commentsContainer = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    colorMode.addEventListener(commentColorModeChange)


    return () => {
      colorMode.removeEventLister(commentColorModeChange)
    }
  }, [])

  useEffect(() => {
    if (!commentsContainer.current)  {
      return 
    }
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        setTimeout(() => {
          const iframe = (mutation.addedNodes[0] as HTMLDivElement).shadowRoot?.querySelector('iframe')
          iframe?.addEventListener('load', () => {
            setLoaded(true);
            observer.disconnect();
          })
        }, 0);
      }
    });

    observer.observe(commentsContainer.current, { childList: true, subtree: true });

    return () => observer?.disconnect();
  }, [])

  return (
    <div className='flex justify-center'>
      <div ref={commentsContainer} className="py-7 sm:w-[95%]">
        {!loaded && <div className='w-full text-center'>评论组件加载中...</div>}
        <Giscus
          id="pathname"
          repo="Sanmimimi/pinlun"
          repoId="R_kgDOPhhjUg"
          category="Announcements"
          categoryId="DIC_kwDOPhhjUs4CuaF4"
          mapping="url"
          reactions-enabled="1"
          emitMetadata="0"
          inputPosition="top"
          theme={mode}
          lang="zh-CN"
        />
      
      </div>
    </div>
  )

}

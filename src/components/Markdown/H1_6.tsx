import React, {
  ComponentPropsWithoutRef,
  ElementType,
  Key,
  MutableRefObject,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { RefObject } from "react";
import { throttleEvent, isBrowser } from "../../utils";

// 自定义优化滚动事件、标题命中事件名称，编写一定乱码，防止和全局其他事件重叠
const optimizedScorll = "optimizedScorll_bo8j3kj";
const matchheading = "matchheading_y19v0d";

// 优化滚动事件
if (isBrowser) {
  throttleEvent("scroll", optimizedScorll);
}

type Heading<T extends ElementType> = (props: ComponentPropsWithoutRef<T>) => JSX.Element;

const headingList = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;

type Headings = {
  [key in typeof headingList[number]]: Heading<key>;
};

// 所有标题组件
const headings: Partial<Headings> = {};

// 所有标题位置的回调
const boundingCBs: {
  [key: string]: () => DOMRect;
} = {};

// 匹配当前滚动位置对应的标题，并把匹配成功的标题信息通过自定义事件 matchheading 分发
if (isBrowser) {
  window.addEventListener(
    optimizedScorll,
    function (e: Event) {
      const keys = Object.keys(boundingCBs);
      // 滚动的偏移值，标题会在距离视区顶部此高度时触发 matchheading 事件
      const offsetHeight = 150;

      for (var i = 0; i < keys.length; i++) {
        const current = boundingCBs[keys[i]]();
        const next = boundingCBs[keys[i + 1]]?.();

        // 判断标题元素是否对应当前视区内容，满足条件分发事件 matchheading
        if ((current.top < offsetHeight && next?.top > offsetHeight) || (i === keys.length - 1 && current.top < 0)) {
          window.dispatchEvent(
            new CustomEvent<MatchHeadingDefail>(matchheading, { detail: { name: keys[i], id: keys[i] } })
          );
          break;
        }
      }
    },
    false
  );
}

// 在 boundingCBs 中写入标题位置
function useDispatchPosition(id: string, ref: RefObject<HTMLHeadingElement>) {
  useEffect(() => {
    if (ref.current instanceof HTMLHeadingElement) {
      boundingCBs[id] = () => {
        return ref.current!.getBoundingClientRect();
      };
    }
    return () => void delete boundingCBs[id];
  }, [ref]);
}

// 生成 h1 ~ h6 组件
[1, 2, 3, 4, 5, 6].forEach(
  (level) =>
    (headings[`h${level}` as typeof headingList[number]] = ({ children, ...rest }) => {
      const ref = useRef<HTMLHeadingElement>(null);

      // renderAst 会传入一个数组，把标题放在数组的首位
      const id = children.toString();

      useDispatchPosition(id, ref);

      return React.createElement(`h${level}`, { id, ...rest, ref }, [
        <a key={id} href={`#${id}`}>
          {children}
        </a>,
      ]);
    })
);

export default headings;

export interface MatchHeadingDefail {
  name: string;
  id: string;
}

/** 获取当前内容对应标题的 hook */
export function useCurrentHeading(deps: any[] = []) {
  const [detail, setDetail] = useState<MatchHeadingDefail>({ name: "", id: "" });

  // 默认执行一次 scroll，触发匹配标题进行事件提交，完成初始化效果

  useEffect(() => {
    function handleMatchHeading(e: CustomEvent<MatchHeadingDefail>) {
      setDetail(e.detail);
    }

    window.addEventListener(matchheading, handleMatchHeading as EventListener, false);
    return () => window.removeEventListener(matchheading, handleMatchHeading as EventListener);
  }, deps);

  return detail;
}

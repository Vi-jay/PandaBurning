import * as path from "path";
export default class PathUtils {
}
// 将startPath作为标准路径，静态资源的路径和项目中使用到的路径全部由startPath起始
PathUtils.startPath = path.join(__dirname, '..');
PathUtils.resolvePath = (dirPath) => {
    return path.join(PathUtils.startPath, dirPath || '.');
};

import * as path from "path";

export default class PathUtils {
    // 将startPath作为标准路径，静态资源的路径和项目中使用到的路径全部由startPath起始
    public static startPath = process.env.NODE_ENV === 'development' ? path.join(__dirname, '..') : process["resourcesPath"];
    public static resolvePath = (dirPath) => {
        return path.join(PathUtils.startPath, 'extraResources', dirPath || '.');
    };
}
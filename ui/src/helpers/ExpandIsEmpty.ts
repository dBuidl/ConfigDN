export default function ExpandIsEmpty(expand: any): boolean {
    if (Array.isArray(expand) && expand.length > 0) {
        return false;
    } else if (typeof expand === 'object' && Object.keys(expand).length > 0) {
        return false;
    }

    return true;
}
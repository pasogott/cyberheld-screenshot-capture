

export async function downloadImage(imageUri, filename) {
    console.log('downloadImage');
    let blob = await fetch(imageUri).then(res => res.blob());
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

//down info as json
export async function downloadImageInfo(infoData) {
    console.log('downloadInfo');
    let blob = new Blob([JSON.stringify(infoData, null, 2)], { type: 'application/json' });
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = `${infoData.uuid}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

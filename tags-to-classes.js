;(function () {
	"use strict"
	const tagsToClasses = document.getElementById(
		"ceros-tags-to-classes-plugin"
	)
	const objectNames = (
		tagsToClasses?.getAttribute("objects-names") || ""
	).split(" ")
	const objects = []
	require.config({
		paths: {
			CerosSDK: "//sdk.ceros.com/standalone-player-sdk-v5.min"
		}
	})
	require(["CerosSDK"], (CerosSDK) => {
		CerosSDK.findExperience()
			.fail(function (error) {
				console.error(error)
			})
			.done(function (experience) {
				window.myExperience = experience
				const getTaggedObject = (tagName) => {
					const layersResult = experience.findLayersByTag(tagName)
					if (layersResult.layers.length > 0) {
						return layersResult
					}
					const syncedObjectsResult =
						experience.findSyncedObjectsByTag(tagName)
					if (syncedObjectsResult.syncedObjects.length > 0) {
						return syncedObjectsResult
					}
					return { layers: [] }
				}
				const initialProcess = () => {
					if (objectNames[0] === "") {
						console.warn("array 'objectNames' is empty")
						return
					}
					objectNames.forEach((tagName) => {
						objects.push(getTaggedObject(tagName))
					})
				}
				const pageChangedCallback = () => {
					objects.forEach((objectData, index) => {
						objectData.layers.forEach(({ id }) => {
							$(`#${id}`).addClass(objectNames[index])
						})
					})
				}
				initialProcess()
				experience.on(CerosSDK.EVENTS.PAGE_CHANGED, pageChangedCallback)
			})
	})
})()

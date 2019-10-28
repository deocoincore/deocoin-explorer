'use strict';

angular.module('insight.networks')
	.factory('Networks',
		function(Constants, DeocoinCoreLib) {
			return {
				getCurrentNetwork: function () {
					return DeocoinCoreLib.Networks.get(Constants.NETWORK);
				}
			}
		});
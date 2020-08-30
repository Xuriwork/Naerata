import React, { useCallback, useMemo } from 'react';
import qs from 'query-string';
import startCase from 'lodash/startCase';
import { History, LocationState } from 'history';
import RotateIcon from '../../assets/icons/rotate-icon.svg';

import {
	Avatar,
	bodyMap,
	hairMap,
	AvatarProps,
	clothingMap,
	eyesMap,
	eyebrowsMap,
	mouthsMap,
	facialHairMap,
	accessoryMap,
	hatMap,
	graphicsMap,
	theme,
} from '@bigheads/core';
import { getRandomOptions } from './getRandomOptions';

type SettingMaps = {
	[key in keyof AvatarProps]: any;
};

const settingMaps: SettingMaps = {
	faceMask: { true: 'true', false: 'false' },
	faceMaskColor: theme.colors.clothing,
	body: bodyMap,
	lipColor: theme.colors.lipColors,
	skinTone: theme.colors.skin,
	hair: hairMap,
	hairColor: theme.colors.hair,
	clothing: clothingMap,
	clothingColor: theme.colors.clothing,
	graphic: graphicsMap,
	eyes: eyesMap,
	eyebrows: eyebrowsMap,
	mouth: mouthsMap,
	facialHair: facialHairMap,
	accessory: accessoryMap,
	hat: hatMap,
	hatColor: theme.colors.clothing,
	lashes: { true: 'true', false: 'false' },
};

interface EditorProps {
	location: Location;
	history: History<LocationState>;
}

const Editor = ({ location, history }: EditorProps) => {
	const props = useMemo(
		() => (location.search ? qs.parse(location.search) : getRandomOptions()),
		[location.search]
	);

	const updateProp = useCallback(
		(e) => {
			const name = e.target.name;
			const value = e.target.value;

			history.push(
				`/settings/character-editor?${qs.stringify({
					...props,
					[name]: value,
				})}`
			);
		},
		[props, history]
	);

	const randomize = useCallback(() => {
		history.push(`/settings/character-editor?${qs.stringify(getRandomOptions())}`);
	}, [history]);

	// const svgUrl = useMemo(
	// 	() =>
	// 		`/svg?${qs.stringify(
	// 			Object.entries(props).reduce(
	// 				(total, [key, value]) => ({ ...total, [key]: value }),
	// 				{}
	// 			)
	// 		)}`,
	// 	[props]
	// );

	//const imgCode = `<img src="https://bigheads.io${svgUrl}" alt="Big Head" />`;

	return (
		<div className='character-editor-component'>
			<div className='character-container'>
				<Avatar
					{...props}
					lashes={props.lashes === 'true'}
					mask={true}
					faceMask={props.faceMask === 'true'}
				/>
			</div>
			<div className='settings-container'>
				<h2>
					Settings{' '}
					<button onClick={randomize} className='randomize-button'>
                        <img src={RotateIcon} alt='random' />
						Random
					</button>
				</h2>
				<div className='settings-list'>
					{Object.entries(settingMaps).map(([key, map]) => (
						<div key={key}>
							<label htmlFor='body'>{startCase(key)}</label>
							<select
								id={key}
								name={key}
								defaultValue={`${props[key as keyof AvatarProps]}`}
								onChange={updateProp}
								className='character-select'
							>
								{Object.keys(map).map((value) => (
									<option key={value} value={value}>
										{startCase(value)}
									</option>
								))}
							</select>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Editor;

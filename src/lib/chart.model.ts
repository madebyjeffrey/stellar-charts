export enum AxisType {
	ContinuousLinear,
	ContinuousSpecial,
	Category
}

export interface ChartModel {
	title: string;
	yAxisRange: [number, number]; // continuous
	yAxisValues: number[]; // category
	yAxisRangeValues: number[]; // the piece-wise ranges, to calculate position not to display
	xAxisValues: number[];
	xAxisTitle: string;
	xAxisValueLabel: (value: number) => string;
	yAxisValueLabel: (value: number) => string;
	data: { x: number; y: number }[];
	highlightMinRange?: number;
	freeXValue: number;
}

export class CategoryAxis<T> {
	private rangeMin: number;
	private rangeMax: number;

	// padding between bands, in range units
	innerPadding: number;

	// padding between range limits and bands, in range units
	outerPadding: number;

	constructor(
		private domain: T[],
		private range: [number, number]
	) {
		this.rangeMax = range[1];
		this.rangeMin = range[0];

		this.outerPadding = 0;
		this.innerPadding = 0;
	}

	private unpaddedBandwidth(): number {
		return (this.rangeMax - this.rangeMin - this.outerPadding * 2) / this.domain.length;
	}

	bandwidth(): number {
		return this.unpaddedBandwidth() - this.innerPadding;
	}

	min(domain: T): number {
		const index = this.domain.indexOf(domain);

		return index * this.unpaddedBandwidth() + this.outerPadding + this.innerPadding / 2;
	}

	max(domain: T): number {
		const index = this.domain.indexOf(domain);

		return (index + 1) * this.unpaddedBandwidth() + this.outerPadding - this.innerPadding / 2;
	}

	centre(domain: T): number {
		const index = this.domain.indexOf(domain);

		return (index + 0.5) * this.unpaddedBandwidth() + this.outerPadding;
	}
}

// This axis is divided equally among the domain values given, but the lengths of the
// domain pieces are not necessarily the same length
export class PiecewiseAxis {
	private rangeMin: number;
	private rangeMax: number;

	// padding between range limits and pieces, in range units
	outerPadding: number;

	sectionMax: number[];
	sectionMin: number[];

	sections: number;
	sectionRangeWidth: number;

	constructor(
		private domain: number[],
		private range: [number, number]
	) {
		this.rangeMax = range[1];
		this.rangeMin = range[0];

		this.sections = domain.length;
		this.sectionRangeWidth = (this.rangeMax - this.rangeMin) / this.sections;

		this.outerPadding = 0;

		this.sectionMax = domain;
		this.sectionMin = [0, ...domain.slice(0, this.domain.length - 1)];
	}

	private sectionFor(input: number): number {
		for (let i = 0; i < this.sectionMax.length; i++) {
			if (input < this.sectionMax[i]) {
				return i;
			}
		}

		return -1;
	}

	private sectionWidth(section: number): number {
		return this.sectionMax[section] - this.sectionMin[section];
	}

	rangeValue(input: number) {
		if (input < this.sectionMin[0] || input > this.sectionMax[this.sectionMax.length - 1]) {
			throw new Error('Invalid range value');
		}

		const section = this.sectionFor(input);

		// pixel offset within section
		const px1 =
			((input - this.sectionMin[section]) / this.sectionWidth(section)) * this.sectionRangeWidth;
		return px1 + this.sectionRangeWidth * section;
	}
}

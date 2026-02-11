export function InfoSection() {
  return (
    <div className="space-y-12">
      <section>
        <h2 className="text-2xl font-bold text-navy mb-4">
          What is the First Home Owners' Grant (FHOG)?
        </h2>
        <p className="text-gray-600 leading-relaxed">
          If you're buying or building your first home, you may be eligible for a $10,000 to $50,000 one-off
          payment from the Government. The grant can be used to buy a land and house package, house, townhouse,
          unit, apartment or similar if it is bought off-the-plan, newly built or substantially renovated.
        </p>
        <p className="text-gray-600 leading-relaxed mt-3">
          The FHOG scheme is national. It is funded by the separate state governments and administered under their
          respective legislations and must satisfy specific eligibility criteria which varies by state.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-navy mb-6">
          Does the grant vary between States?
        </h2>
        <p className="text-gray-600 leading-relaxed mb-6">
          Yes. Eligibility for the First Home Owners' Grant varies depending on which state or territory you
          buy your first home. Below is an overview by state.
        </p>

        <div className="space-y-6">
          <StateInfo
            title="Queensland"
            description="The Queensland First Home Owners' Grant provides $30,000 for contracts signed between 20 November 2023 and 30 June 2026 towards a potential first home owner's deposit if they're buying or building a new house, unit, or townhouse worth less than $750,000."
          />
          <StateInfo
            title="New South Wales"
            description="In New South Wales, the First Home Owner Grant (New Homes) Scheme is valued to the tune of $10,000 for properties valued up to $600,000 and new home buildings at $750,000. Eligible homes can be a house, townhouse, apartment, unit or similar that is newly built, purchased off the plan, or substantially renovated."
          />
          <StateInfo
            title="Victoria"
            description="In Metropolitan Victoria (Melbourne), first home buyers buying or building a new home can be eligible for a $10,000 First Home Owner Grant, if the contract was signed on or after 1 July 2013 and the property is valued up to $750,000 or less."
          />
          <StateInfo
            title="South Australia"
            description="South Australia offers a $15,000 grant to first home buyers building or purchasing new homes."
          />
          <StateInfo
            title="Western Australia"
            description="In WA, first home buyers can receive up to $10,000 towards buying or building new homes. The maximum value depends on location: $750,000 south of the 26th parallel and $1,000,000 north of the 26th parallel."
          />
          <StateInfo
            title="Northern Territory"
            description="The Northern Territory offers a grant of $10,000 to $50,000 towards buying or building a new home. Unlike most other states, income and house value does not affect your eligibility."
          />
          <StateInfo
            title="Australian Capital Territory"
            description="The ACT First Home Owner Grant has been replaced by the Home Buyer Concession Scheme, which provides a full stamp duty concession for eligible applicants."
          />
          <StateInfo
            title="Tasmania"
            description="The Tasmanian Government provides first home buyers with a $10,000 grant for transactions from 1 July 2024, provided they purchase or build a new home. Tasmania does not place a limit on the purchase price."
          />
        </div>
      </section>
    </div>
  )
}

function StateInfo({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h3 className="text-lg font-bold text-navy mb-2">{title}</h3>
      <p className="text-gray-600 leading-relaxed text-sm">{description}</p>
    </div>
  )
}
